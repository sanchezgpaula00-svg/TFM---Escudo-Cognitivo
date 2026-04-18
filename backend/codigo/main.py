from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
import json
from datetime import datetime
import os

prompt_sistema = (
        "Eres un experto en ciberseguridad. Analiza el texto para detectar ingeniería social. "
        "REGLAS CRÍTICAS PARA PUNTUAR (0-10): "
        "1. urgency: Exigencia de actuar rápido. "
        "2. coercion: Amenazas o consecuencias negativas si no se actúa. "
        "3. authority: Uso de un cargo o entidad PARA FORZAR UNA ACCIÓN INUSUAL O SALTARSE NORMAS. "
        "IMPORTANTE: Si el mensaje es un aviso puramente informativo de una institución real (ej. Universidad, Banco) y no pide acciones urgentes o inusuales, 'authority' DEBE SER 0. "
        "Responde ÚNICAMENTE en JSON con las claves: urgency, coercion, authority."
    )

app = FastAPI(title="Backend Seguridad Inclusiva")

# Configuración CORS para permitir que la extensión se conecte
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # En producción se restringe, pero para la PoC en local lo dejamos abierto
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de datos para recibir el texto
class EmailContent(BaseModel):
    text: str

def guardar_log_auditoria(texto_entrada, ia_data, nivel_alerta, mensaje_error=None):
    """Guarda cada petición, incluyendo los errores si la IA falla."""
    registro = {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "input": texto_entrada,
        "scores_ia": ia_data,
        "decision_final": nivel_alerta
    }
    
    # Si hay un error, lo añadimos al registro
    if mensaje_error:
        registro["error"] = mensaje_error
        
    directorio_actual = os.path.dirname(os.path.abspath(__file__))
    ruta_log = os.path.join(directorio_actual, "registro_analisis.log")
    
    with open(ruta_log, "a", encoding="utf-8") as archivo_log:
        archivo_log.write(json.dumps(registro, ensure_ascii=False) + "\n")

@app.post("/analyze")
async def analyze_threat(content: EmailContent):
    try:
        response = ollama.chat(model='llama3', messages=[
            {
                'role': 'system',
                'content': prompt_sistema
            },
            {
                'role': 'user',
                'content': content.text,
            },
        ])
        
        # Obtenemos el JSON de la IA y lo convertimos a un diccionario de Python
        ia_result_str = response['message']['content']
        ia_data = json.loads(ia_result_str)
        
        # LÓGICA DE DETECCIÓN (Tu aportación de valor al TFM)
        if ia_data.get('urgency', 0) <= 2 and ia_data.get('coercion', 0) <= 2:
            score_total = 0 # Lo forzamos a seguro
        else:
            score_total = ia_data.get('urgency', 0) + ia_data.get('coercion', 0) + ia_data.get('authority', 0)
        
        nivel_alerta = "SEGURO"
        color = "VERDE"
        
        if score_total >= 18 or ia_data.get('coercion', 0) >= 8:
            nivel_alerta = "PELIGRO CRÍTICO"
            color = "ROJO"
        elif score_total >= 10 or ia_data.get('urgency', 0) >= 7:
            nivel_alerta = "SOSPECHOSO"
            color = "AMARILLO"
            
        guardar_log_auditoria(content.text, ia_data, nivel_alerta)
        
        # Devolvemos un paquete completo y procesado para la extensión
        return {
            "ia_raw_scores": ia_data,
            "analisis_cognitivo": {
                "nivel": nivel_alerta,
                "color_sugerido": color,
                "puntuacion_total": score_total
            }
        }
    except json.JSONDecodeError:
        # Guardamos el log del fallo
        guardar_log_auditoria(
            texto_entrada=content.text, 
            ia_data={"urgency": 0, "coercion": 0, "authority": 0}, 
            nivel_alerta="ERROR_FORMATO",
            mensaje_error="La IA no devolvió un JSON"
        )
        # Devolvemos un JSON amigable para el frontend
        return {
            "ia_raw_scores": {"urgency": 0, "coercion": 0, "authority": 0},
            "analisis_cognitivo": {
                "nivel": "ERROR DE ANÁLISIS",
                "color_sugerido": "GRIS",
                "puntuacion_total": 0,
                "detalle": "El texto tiene un formato no válido o es demasiado complejo."
            }
        }
        
    except Exception as e:
        # Guardamos el log de fallos generales
        guardar_log_auditoria(
            texto_entrada=content.text, 
            ia_data={"urgency": 0, "coercion": 0, "authority": 0}, 
            nivel_alerta="ERROR_SISTEMA",
            mensaje_error=str(e)
        )
        return {
            "ia_raw_scores": {"urgency": 0, "coercion": 0, "authority": 0},
            "analisis_cognitivo": {
                "nivel": "SISTEMA CAÍDO",
                "color_sugerido": "GRIS",
                "puntuacion_total": 0,
                "detalle": f"Fallo interno: {str(e)}"
            }
        }
