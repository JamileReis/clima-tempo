package adapters

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/monitor-clima/worker/src/domain"
)

type HTTPCollectorAdapter struct {
	client  *http.Client
	baseURL string
}

func NewHTTPCollectorAdapter() *HTTPCollectorAdapter {
	baseURL := os.Getenv("COLLECTOR_SERVICE_URL")
	if baseURL == "" {
		baseURL = "http://collector:8080"
	}

	return &HTTPCollectorAdapter{
		client:  &http.Client{Timeout: 15 * time.Second},
		baseURL: baseURL,
	}
}

func (a *HTTPCollectorAdapter) FetchWeatherData(request domain.MonitorRequest) (string, error) {
	payload, err := json.Marshal(request)
	if err != nil {
		return "", fmt.Errorf("erro ao serializar requisicao: %w", err)
	}

	url := fmt.Sprintf("%s/v1/collect", a.baseURL)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	if err != nil {
		return "", fmt.Errorf("erro ao criar requisicao: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := a.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("falha ao conectar com o servico collector: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("collector retornou status %d", resp.StatusCode)
	}

	var responseBody map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&responseBody); err != nil {
		return "", fmt.Errorf("erro ao deserializar resposta do collector: %w", err)
	}

	resultJson, _ := json.Marshal(responseBody)
	return string(resultJson), nil
}
