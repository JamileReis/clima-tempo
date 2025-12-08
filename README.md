ARQUITETURA GERAL DA APLICAÇÃO

A aplicação segue uma arquitetura moderna baseada em microsserviços, com responsabilidades bem definidas e comunicação assíncrona via Message Broker (RabbitMQ).

A arquitetura foi projetada com três objetivos:

✔ Escalabilidade
✔ Resiliência
✔ Baixo acoplamento  
          ┌─────────────────────────┐AA
          │     OpenWeather API     │
          └─────────────┬───────────┘
                        │
                        ▼
            ┌──────────────────────┐
            │ Python Collector     │
            │ coleta clima real    │
            └─────────────┬────────┘
                          │ envia JSON
                          ▼
                ┌──────────────────┐
                │  RabbitMQ (fila) │
                └──────────┬───────┘
                           │
                           ▼
              ┌─────────────────────┐
              │ Go Worker           │
              │ valida + envia p/   │
              │ API NestJS          │
              └──────────┬──────────┘
                         │ POST
                         ▼
              ┌──────────────────────┐
              │  API NestJS          │
              │  - salva no MongoDB  │
              │  - insights IA       │
              │  - dados p/ Frontend │
              └──────────┬───────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │     MongoDB         │
              │  histórico completo │
              └──────────┬──────────┘
                         │
                         ▼
              ┌───────────────────────┐
              │ Frontend (Vite + React)│
              │ gráficos + insights     │
              └─────────────────────────┘
              Este projeto implementa um pipeline completo e moderno de monitoramento climático, usando uma arquitetura distribuída baseada em microsserviços. Ele combina coleta automática de dados meteorológicos, processamento assíncrono, persistência histórica, geração de insights com IA e visualização em um dashboard interativo.

🔄 Pipeline de Dados

Python Collector busca dados reais da OpenWeather e envia para o RabbitMQ.

Worker Go consome as mensagens da fila, valida e envia para a API.

API NestJS recebe o clima, salva no MongoDB e disponibiliza endpoints REST.

Gemini AI gera insights inteligentes com base nos dados coletados.

Frontend React + Vite exibe gráficos, tabelas, clima atual e análises automáticas.

🧱 Principais Tecnologias

Python (coleta de clima)

Go (worker da fila)

RabbitMQ (mensageria)

NestJS (API, autenticação, IA, persistência)

MongoDB (time-series de clima)

React + Vite + Tailwind + Shadcn (dashboard)

Gemini AI (insights meteorológicos)

🐳 Execução Fácil com Docker Compose

Todo o ecossistema pode ser iniciado com apenas:

docker compose up --build -d


Isso sobe automaticamente:

API

Frontend

MongoDB

RabbitMQ

Go Worker

Python Collector
https://drive.google.com/file/d/150q8rpFM1riXoecbEz05lldolxdxJtCF/view?usp=drivesdk
