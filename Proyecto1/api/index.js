const express = require('express');
const mysql = require('mysql2');

// Conexión a MySQL
const connection = mysql.createConnection({
  host: 'mysql-container',    // Puede ser el nombre del contenedor o "localhost"
  user: 'root',               // Usuario MySQL
  password: '1234',           // Contraseña de MySQL
  database: 'datos',          // Nombre de la base de datos
});

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: 'mysql-container',
  user: 'root',
  database: 'datos',
  password: '1234',
  waitForConnections: true,
  connectionLimit: 10,        // Ajustar según el uso
  queueLimit: 0
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
  res.send('<h1>Hello World 2!</h1>');
});

/* ======================================== IDs ======================================== */
// Obteniendo los ids
app.get('/obtenerIds', (req, res) => {
  pool.query('SELECT * FROM t1', (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener los usuarios');
    }
    res.json(results); // Devuelve los resultados en formato JSON
  });
});

// Insertar un id en una tabla si no existe
app.post('/insertarId', (req, res) => {
  const { id } = req.body;

  pool.query('INSERT INTO t1 (id) VALUES (?) ON DUPLICATE KEY UPDATE id = id', [id], (err, results) => {
    if (err) {
      return res.status(500).send('Error al insertar el usuario');
    }
    res.send('Usuario insertado correctamente');
  });
});

/* ======================================== PROCESOS ======================================== */
// Obteniendo los procesos
app.get('/obtenerProcesos', (req, res) => {
  pool.query('SELECT * FROM PROCESO', (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener los procesos');
    }
    res.json(results); // Devuelve los resultados en formato JSON
  });
});

// Obtener un proceso segun su pid
app.post('/obtenerProceso', (req, res) => {
  const { pid } = req.body;

  pool.query('SELECT * FROM PROCESO WHERE pid = ?', [pid], (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener el proceso');
    }
    res.json(results); // Devuelve los resultados en formato JSON
  });
});

// Insertando un proceso
app.post('/insertarProceso', (req, res) => {
  const { pid, name, user, state, ram } = req.body;

  pool.query('INSERT INTO PROCESO (pid, name, user, state, ram) VALUES (?, ?, ?, ?, ?)', [pid, name, user, state, ram], (err, results) => {
    if (err) {
      return res.status(500).send('Error al insertar el proceso');
    }
    res.send('Proceso insertado correctamente');
  });
});

/* ======================================== CPU ======================================== */
app.post('/cpu', (req, res) => {
  const { percentage_used, tasks, ip } = req.body;

  // console.log(`CPU: ${percentage_used}, ${tasks.length}, ${ip}`);

  if (tasks.length === 0) {
    // Si no hay tareas, responde inmediatamente
    return res.status(400).send('No hay procesos para insertar');
  }

  let completedInserts = 0;
  let errorOccurred = false;

  tasks.forEach((task, index) => {
    // console.log(`PID: ${task.pid}, Name: ${task.name}, User: ${task.user}, State: ${task.state}, RAM: ${task.ram}, Father: ${task.father}`);

    pool.query('INSERT INTO process (pid, name, user, state, ram, father, perc, ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [task.pid, task.name, task.user, task.state, task.ram, task.father, percentage_used, ip],
      (err, results) => {
        if (err) {
          console.log(`Error: ${err}`);
          // Si ocurre un error, se marca como ocurrió un error y se responde solo una vez
          if (!errorOccurred) {
            errorOccurred = true;
            return res.status(500).send('Error al insertar el proceso CPU');
          }
        } else {
          completedInserts++;
        }

        // Si ya hemos procesado todos los elementos, respondemos
        if (completedInserts === tasks.length && !errorOccurred) {
          res.send('Todos los procesos CPU insertados correctamente');
        }
      });
  });
});


/* ======================================== RAM ======================================== */
app.post('/ram', (req, res) => {
  const { total_ram, free_ram, used_ram, percentage_used, ip } = req.body;

  // console.log(total_ram, free_ram, used_ram, percentage_used, ip);

  pool.query('INSERT INTO ram (total, free, used, perc, ip) VALUES (?, ?, ?, ?, ?)',
    [total_ram, free_ram, used_ram, percentage_used, ip],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error al insertar el proceso RAM');
      }
      res.send(`Proceso !! RAM !! insertado correctamente.`);
    });

  // res.send('Proceso RAM insertado correctamente');
});

/* ======================================== CONFIGURACION ======================================== */

// Configuramos el puerto en el que el servidor va a escuchar
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});