import requests
import json
import os
import csv 

URL = "http://127.0.0.1:8000/analyze"

def evaluar_modelo():
    #Calculamos la ruta dinámicamente
    dir_actual = os.path.dirname(os.path.abspath(__file__))
    dir_padre = os.path.dirname(dir_actual) 
    ruta_json = os.path.join(dir_padre, "dataset", "phishing.json")
    ruta_csv = os.path.join(dir_actual, "reporte_auditoria.csv")
    
    with open(ruta_json, "r", encoding="utf-8") as f:
        pruebas = json.load(f)
    
    aciertos = 0
    print(f"--- Iniciando Auditoría y Generación de Reporte ({len(pruebas)} pruebas) ---")
    
    with open(ruta_csv, mode="w", newline="", encoding="utf-8-sig") as archivo_csv:
        escritor_csv = csv.writer(archivo_csv, delimiter=";")
        
        escritor_csv.writerow(["ID_Prueba", "Texto_Recortado", "Etiqueta_Real", "Prediccion_IA", "Exito", "Puntuacion_Total", "Urgencia", "Coaccion", "Autoridad"])
        
        for i, item in enumerate(pruebas):
            response = requests.post(URL, json={"text": item["texto"]})
            resultado = response.json()
            
            real = item["etiqueta_real"]
            prediccion = resultado["analisis_cognitivo"]["nivel"]
            total = resultado["analisis_cognitivo"].get("puntuacion_total", 0)
            scores = resultado.get("ia_raw_scores", {"urgency":0, "coercion":0, "authority":0})
            
            exito = "SI" if prediccion == real else "NO"
            if exito == "SI":
                aciertos += 1
            
            texto_completo = item["texto"].replace("\n", " | ")
            
            escritor_csv.writerow([i+1, texto_completo, real, prediccion, exito, total, scores.get('urgency'), scores.get('coercion'), scores.get('authority')])
            
            print(f"Prueba {i+1} procesada y guardada...")
            
    precision = (aciertos / len(pruebas)) * 100
    print("--------------------------------------------------")
    print(f"RESULTADO FINAL: {precision}% de Precisión")
    print(f"Reporte guardado con éxito en: {ruta_csv}")
    print("--------------------------------------------------")

if __name__ == "__main__":
    evaluar_modelo()