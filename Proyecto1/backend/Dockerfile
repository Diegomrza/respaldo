# Dockerfile para el contenedor Go
FROM golang:alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el código Go al contenedor
COPY . .

# Instalar dependencias si las hay
RUN go mod tidy

EXPOSE 5200

# Comando para compilar y ejecutar el programa Go
CMD ["go", "run", "main.go"]
