const express = require('express');
const mysql = require('mysql2');

// Conexión a MySQL
const connection = mysql.createConnection({
    host: 'localhost', // Si estás usando Docker, puede ser el nombre del contenedor o "localhost"
    user: 'root',      // Usuario MySQL
    password: '1234', // Contraseña de MySQL
    database: 'datos', // Nombre de la base de datos
});

const app = express();

app.use(express.json());

// Verifica si la conexión fue exitosa
connection.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

/* ======================================== INICIO ======================================== */
app.get('/', (req, res) => {
    res.send('Hello World!');
});

/* ======================================== IDs ======================================== */
// Obteniendo los ids
app.get('/obtenerIds', (req, res) => {
    connection.query('SELECT * FROM t1', (err, results) => {
        if (err) {
            return res.status(500).send('Error al obtener los usuarios');
        }
        res.json(results); // Devuelve los resultados en formato JSON
    });
});

// Insertar un id en una tabla si no existe
app.post('/insertarId', (req, res) => {
    const { id } = req.body;

    connection.query('INSERT INTO t1 (id) VALUES (?) ON DUPLICATE KEY UPDATE id = id', [id], (err, results) => {
        if (err) {
            return res.status(500).send('Error al insertar el usuario');
        }
        res.send('Usuario insertado correctamente');
    });
});

/* ======================================== PROCESOS ======================================== */
// Obteniendo los procesos
app.get('/obtenerProcesos', (req, res) => {
    connection.query('SELECT * FROM PROCESO', (err, results) => {
        if (err) {
            return res.status(500).send('Error al obtener los procesos');
        }
        res.json(results); // Devuelve los resultados en formato JSON
    });
});

// Obtener un proceso segun su pid
app.post('/obtenerProceso', (req, res) => {
    const { pid } = req.body;

    connection.query('SELECT * FROM PROCESO WHERE pid = ?', [pid], (err, results) => {
        if (err) {
            return res.status(500).send('Error al obtener el proceso');
        }
        res.json(results); // Devuelve los resultados en formato JSON
    });
});

// Insertando un proceso
app.post('/insertarProceso', (req, res) => {
    const { pid, name, user, state, ram } = req.body;

    connection.query('INSERT INTO PROCESO (pid, name, user, state, ram) VALUES (?, ?, ?, ?, ?)', [pid, name, user, state, ram], (err, results) => {
        if (err) {
            return res.status(500).send('Error al insertar el proceso');
        }
        res.send('Proceso insertado correctamente');
    });
});

/* ======================================== CPU ======================================== */
app.post('/cpu', (req, res) => {
    const { percentage_used, tasks } = req.body;

    console.log(percentage_used);
    console.log(tasks);

    // connection.query('INSERT INTO CPU (pid, name, user, state, ram) VALUES (?, ?, ?, ?, ?)', [pid, name, user, state, ram], (err, results) => {
    //     if (err) {
    //         return res.status(500).send('Error al insertar el proceso');
    //     }
    //     res.send('Proceso insertado correctamente');
    // });

    res.send('Proceso CPU insertado correctamente');
});

/* ======================================== RAM ======================================== */
app.post('/ram', (req, res) => {
    const { total_ram, free_ram, used_ram, percentage_used } = req.body;

    console.log(total_ram);
    console.log(free_ram);
    console.log(used_ram);
    console.log(percentage_used);

    // connection.query('INSERT INTO RAM (total_ram, free_ram, used_ram, percentage_used, ram) VALUES (?, ?, ?, ?, ?)', [total_ram, free_ram, used_ram, percentage_used], (err, results) => {
    //     if (err) {
    //         return res.status(500).send('Error al insertar el proceso');
    //     }
    //     res.send('Proceso insertado correctamente');
    // });

    res.send('Proceso RAM insertado correctamente');
});

/* ======================================== CONFIGURACION ======================================== */

// Configuramos el puerto en el que el servidor va a escuchar
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});