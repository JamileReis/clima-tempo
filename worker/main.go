package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/monitor-clima/worker/src/application"
	"github.com/monitor-clima/worker/src/infrastructure/adapters"
	"github.com/monitor-clima/worker/src/infrastructure/rabbitmq"
)

func main() {
	log.Println("[INFRA] Worker iniciado.")

	if os.Getenv("COLLECTOR_SERVICE_URL") == "" {
		log.Fatalf("[FATAL] A variavel COLLECTOR_SERVICE_URL nao foi definida. Verifique seu .env.")
	}

	collectorAdapter := adapters.NewHTTPCollectorAdapter()

	monitorService := application.NewMonitorService(collectorAdapter)

	log.Println("[INFRA] Aguardando 5s antes de conectar ao RabbitMQ...")
	time.Sleep(5 * time.Second)

	consumer := rabbitmq.NewConsumer(monitorService)
	consumer.Connect()
	defer consumer.Close()

	go consumer.Consume()

	log.Println("[INFRA] Worker pronto. Aguardando mensagens...")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("[INFRA] Desligamento iniciado.")
}
