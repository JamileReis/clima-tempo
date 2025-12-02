from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os
from collector import fetch_weather_data 
from dotenv import load_dotenv

load_dotenv()

class WeatherRequest(BaseModel):
    city: str
    country: str
    requestId: Optional[str] = None

class WeatherResponse(BaseModel):
    city: str
    temp: float
    humidity: int
    collected_at: str

app = FastAPI(title="Weather Collector Service")

@app.post("/v1/collect", response_model=WeatherResponse, status_code=200)
def collect_weather_data(request: WeatherRequest):

    try:
        collector_request = CollectorRequest(
            city=request.city,
            country=request.country
        )
        
        result = fetch_weather_data(collector_request)
        
        return WeatherResponse(
            city=result.city,
            temp=result.temp,
            humidity=result.humidity,
            collected_at=result.collected_at
        )
        
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Erro de configuracao do Collector: {e}")
        
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=f"Erro na API externa: {e}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)