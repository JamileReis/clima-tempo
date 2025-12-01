package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/monitor-clima/worker/src/application"
	"github.com/monitor-clima/worker/src/infrastructure/adapters"
	"github.com/monitor-clima/worker/src/infrastructure/rabbitmq"
)

func main() {
	log.Println("[INFRA] Worker iniciado.")

	weatherAPIAdapter := adapters.NewWeatherAPIAdapter()

	monitorService := application.NewMonitorService(weatherAPIAdapter)

	consumer := rabbitmq.NewConsumer(monitorService)
	consumer.Connect()
	defer consumer.Close()

	go consumer.Consume()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("[INFRA] Sinal de desligamento recebido. Encerrando o Worker...")
}
