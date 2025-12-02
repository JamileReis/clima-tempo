import os
import requests
import json

API_KEY = os.environ.get("WEATHER_API_KEY")
BASE_URL = "http://api.openweathermap.org/data/2.5/weather"
class CollectorRequest:
    city: str
    country: str
class CollectorResult:
    city: str
    temp: float
    humidity: int
    collected_at: str

def fetch_weather_data(request: CollectorRequest) -> CollectorResult:
    
    if not API_KEY:
        raise ValueError("WEATHER_API_KEY não configurada.")

    params = {
        'q': f"{request.city},{request.country}",
        'appid': API_KEY,
        'units': 'metric'
    }

    try:
        response = requests.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status() 
        data = response.json()
        
        return CollectorResult(
            city=data.get('name'),
            temp=data.get('main', {}).get('temp'),
            humidity=data.get('main', {}).get('humidity'),
            collected_at=json.dumps({"timestamp": requests.utils.time()})
        )

    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Falha na requisição externa: {e}")