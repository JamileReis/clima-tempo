FROM golang:1.22 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o worker .

FROM alpine:latest
WORKDIR /root/
RUN apk add --no-cache ca-certificates

COPY --from=builder /app/worker .
RUN chmod +x worker

CMD ["./worker"]