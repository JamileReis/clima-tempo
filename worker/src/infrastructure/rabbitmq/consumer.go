package rabbitmq

import (
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/monitor-clima/worker/src/application"
	"github.com/monitor-clima/worker/src/domain"
	"github.com/streadway/amqp"
)

type Consumer struct {
	monitorService *application.MonitorService
	conn           *amqp.Connection
	channel        *amqp.Channel
	queueName      string
}

func NewConsumer(service *application.MonitorService) *Consumer {
	return &Consumer{
		monitorService: service,
		queueName:      os.Getenv("QUEUE_NAME"),
	}
}

func (c *Consumer) Connect() {
	uri := os.Getenv("RABBITMQ_URI")
	if uri == "" {
		log.Fatal("[INFRA] Variável RABBITMQ_URI não definida.")
	}

	for i := 0; i < 5; i++ {
		var err error
		c.conn, err = amqp.Dial(uri)
		if err == nil {
			log.Println("[INFRA] Conexão RabbitMQ estabelecida.")
			break
		}
		log.Printf("[INFRA] Tentativa %d/5: Falha ao conectar, tentando novamente em 5s...", i+1)
		time.Sleep(5 * time.Second)
	}

	if c.conn == nil {
		log.Fatal("[INFRA] Falha fatal ao conectar ao RabbitMQ.")
	}

	var err error
	c.channel, err = c.conn.Channel()
	if err != nil {
		log.Fatalf("[INFRA] Falha ao abrir o canal: %v", err)
	}

	_, err = c.channel.QueueDeclare(c.queueName, true, false, false, false, nil)
	if err != nil {
		log.Fatalf("[INFRA] Falha ao declarar a fila: %v", err)
	}

	c.channel.Qos(1, 0, false)

	log.Printf("[INFRA] Consumidor registrado na fila: %s", c.queueName)
}

func (c *Consumer) Consume() {
	msgs, err := c.channel.Consume(
		c.queueName,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("[INFRA] Falha ao registrar o consumidor: %v", err)
	}

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			log.Printf("[INFRA] Mensagem recebida. Tag: %d", d.DeliveryTag)

			var request domain.MonitorRequest
			if err := json.Unmarshal(d.Body, &request); err != nil {
				log.Printf("[INFRA] Erro ao deserializar JSON: %v. Rejeitando mensagem (não processável).", err)
				d.Reject(false)
				continue
			}

			c.monitorService.ProcessRequest(request)

			d.Ack(false)
			log.Printf("[INFRA] Mensagem %s ACKed com sucesso.", request.RequestId)
		}
	}()

	<-forever
}

func (c *Consumer) Close() {
	log.Println("[INFRA] Fechando conexão RabbitMQ.")
	c.channel.Close()
	c.conn.Close()
}
