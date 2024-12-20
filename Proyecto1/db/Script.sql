-- CREATE DATABASE datos;

USE datos;

-- Tabla de RAM
CREATE TABLE ram (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total FLOAT NOT NULL,
  free FLOAT NOT NULL,
  used FLOAT NOT NULL,
  perc FLOAT NOT NULL,
  ip VARCHAR(100) NOT NULL  -- Columna para almacenar la IP de la máquina
);

-- Tabla de Procesos
CREATE TABLE process (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pid INT,
  name VARCHAR(255) NOT NULL,
  user INT NOT NULL,
  state INT NOT NULL,
  ram FLOAT NOT NULL,
  father INT,
  perc FLOAT NOT NULL,
  ip VARCHAR(100) NOT NULL  -- Columna para almacenar la IP de la máquina
);
