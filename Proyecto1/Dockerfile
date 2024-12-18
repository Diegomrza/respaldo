# Usa la imagen oficial de MySQL como base
FROM mysql:latest

# Establece las variables de entorno para MySQL
ENV MYSQL_ROOT_PASSWORD=1234
ENV MYSQL_DATABASE=prueba
ENV MYSQL_USER=squery
ENV MYSQL_PASSWORD=12345

# Exponemos el puerto 3306, que es el puerto por defecto de MySQL
EXPOSE 3306

# Comando por defecto para iniciar el servicio de MySQL
CMD ["mysqld"]
