import requests
import json
import time
import os

URL = "http://127.0.0.1:8000/analyze"

def evaluar_modelo():
    with open("../dataset/phishing.json", "r", encoding="utf-8") as f:
        pruebas = json.load(f)
    
    aciertos = 0
    print(f"--- Iniciando Evaluación de Auditoría ({len(pruebas)} pruebas) ---")
    
    for i, item in enumerate(pruebas):
        response = requests.post(URL, json={"text": item["texto"]})
        resultado = response.json()
        
        prediccion = resultado["analisis_cognitivo"]["nivel"]
        real = item["etiqueta_real"]
        
        scores = resultado.get("ia_raw_scores", {})
        total = resultado["analisis_cognitivo"].get("puntuacion_total", "?")
        
        print(f"Prueba {i+1}: Real={real} | Pred={prediccion} | Total={total} | {scores}")
        
        if prediccion == real:
            aciertos += 1
        
    precision = (aciertos / len(pruebas)) * 100
    print("--------------------------------------------------")
    print(f"RESULTADO FINAL: {precision}% de Precisión")
    print("--------------------------------------------------")

if __name__ == "__main__":
    evaluar_modelo()