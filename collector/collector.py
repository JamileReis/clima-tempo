import requests
import json
import time
import schedule
from dotenv import load_dotenv
import os
import sys
from datetime import datetime

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")
CITY = os.getenv("CITY", "Araci,BR")
URL_BASE = os.getenv("OPENWEATHER_API_URL", "https://api.openweathermap.org/data/2.5")
OUTPUT_FILE = os.getenv("OUTPUT_FILE", "weather_data.json")

def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{ts}] {msg}", flush=True)

def coletar_dados():
    if not API_KEY:
        log("OPENWEATHER_API_KEY não encontrada no .env. Pare e configure a chave.")
        return

    log(f"Buscando dados para: {CITY}")

    try:
        url = f"{URL_BASE}/weather"
        params = {
            "q": CITY,
            "appid": API_KEY,
            "units": "metric",
            "lang": "pt_br"
        }
        resp = requests.get(url, params=params, timeout=15)
        resp.raise_for_status()
        response = resp.json()

        dados = {
            "cidade": CITY,
            "timestamp_utc": datetime.utcnow().isoformat() + "Z",
            "temperatura_c": response.get("main", {}).get("temp"),
            "sensacao_termica_c": response.get("main", {}).get("feels_like"),
            "umidade_pct": response.get("main", {}).get("humidity"),
            "vento_m_s": response.get("wind", {}).get("speed"),
            "condicao": response.get("weather", [{}])[0].get("description"),
            "pressao_hpa": response.get("main", {}).get("pressure"),
            "nuvens_pct": response.get("clouds", {}).get("all"),
            "prob_chuva_mm_1h": response.get("rain", {}).get("1h", 0),
            "prob_chuva_mm_3h": response.get("rain", {}).get("3h", 0)
        }

        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(dados, f, ensure_ascii=False, indent=4)

        log(f"Dados salvos em: {OUTPUT_FILE}")

    except requests.exceptions.RequestException as e:
        log(f"Erro na requisição HTTP: {e}")
    except json.JSONDecodeError:
        log("Resposta não é JSON válido.")
    except Exception as e:
        log(f"Erro inesperado: {e}")

def main():

    coletar_dados()

    schedule.every(1).hours.do(coletar_dados)

    log("⏳ Coletor ativo — rodando a cada 1 hora. Pressione CTRL+C para sair.")
    try:
        while True:
            schedule.run_pending()
            time.sleep(1)
    except KeyboardInterrupt:
        log(" Coletor interrompido pelo usuário.")
        sys.exit(0)

if __name__ == "__main__":
    main()