package domain

type MonitorRequest struct {
	City      string `json:"city"`
	Country   string `json:"country"`
	RequestId string `json:"requestId"`
}
