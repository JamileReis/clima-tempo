package adapters

import (
	"fmt"
	"time"

	"github.com/monitor-clima/worker/src/domain"
)

type WeatherAPIAdapter struct {
}

func NewWeatherAPIAdapter() *WeatherAPIAdapter {
	return &WeatherAPIAdapter{}
}

func (a *WeatherAPIAdapter) FetchWeatherData(request domain.MonitorRequest) (string, error) {

	result := fmt.Sprintf("{\"city\": \"%s\", \"temp\": 25.0, \"timestamp\": \"%s\"}",
		request.City,
		time.Now().Format(time.RFC3339),
	)
	return result, nil
}
