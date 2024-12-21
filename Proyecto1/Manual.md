# Manual tecnico - 201901429

### Agente de golang
Se creo un agente escrito en el lenguaje go para monitorizar el uso de ram y cpu de las maquinas virtuales en las que se este ejecutando el servicio. Finalmente se construyo la imagen con todas estas configuraciones y se subio a docker hub

- imports y structs de go

![imports-go](./img/go-imports%20y%20structs.png)

- obtencion de datos

![obtencion-go](./img/go-obtencion%20datos.png)

- y peticion a la api

![peticion-go](./img/go-peticion%20api.png)

### API nodejs
Se creo una api la cual se encarga de recibir los datos recibidos a traves del agente de monitoreo de golang y almacenarlos en la base de datos de mysql. Finalmente se construyo la imagen con todas estas configuraciones y se subio a docker hub

- import de express y mysql2 para la conexion con la base de datos

![import-node](./img/api-imports%20endpoint.png)

### Base de datos mysql

Para el almacenamiento de los datos recibidos a traves de la api de nodejs se creo una base de datos en mysql, la cual mediante un volumen de docker guardara sus datos de manera persistente aun cuando el contenedor sea eliminado. Finalmente se construyo la imagen con todas estas configuraciones y se subio a docker hub



### Modulos de kernel

### Despliegue con docker-file

Para el despliegue controlado de varios contenedores se utilizo la herramienta docker-compose, la cual por medio de un archivo de configuracion levanta los contenedores y los detiene cuando se detiene el servicio de docker compose.

### GCP