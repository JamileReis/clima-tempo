package application

import (
	"log"
	"time"

	"github.com/monitor-clima/worker/src/domain"
)

type WeatherApiPort interface {
	FetchWeatherData(request domain.MonitorRequest) (string, error)
}

type MonitorService struct {
	weatherAPI WeatherApiPort
}

func NewMonitorService(api WeatherApiPort) *MonitorService {
	return &MonitorService{weatherAPI: api}
}

func (s *MonitorService) ProcessRequest(request domain.MonitorRequest) {
	log.Printf("[APP] Processando requisição %s para %s/%s", request.RequestId, request.City, request.Country)

	time.Sleep(1 * time.Second)

	data, err := s.weatherAPI.FetchWeatherData(request)
	if err != nil {
		log.Printf("[APP] Requisicao %s - ERRO ao buscar dados: %v", request.RequestId, err)
		return
	}

	log.Printf("[APP] Requisicao %s - Dados coletados com sucesso: %s", request.RequestId, data)
}
