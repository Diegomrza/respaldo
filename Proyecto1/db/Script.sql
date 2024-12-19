-- CREATE DATABASE datos;

USE datos;

CREATE TABLE cpu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usage_ FLOAT NOT NULL
);

CREATE TABLE process (
    pid INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user INT NOT NULL,
    state INT NOT NULL,
    ram FLOAT NOT NULL,
    father INT,
    cpu_id INT,
    FOREIGN KEY (cpu_id) REFERENCES cpu(id)
);

CREATE TABLE ram (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total FLOAT NOT NULL,
    free FLOAT NOT NULL,
    used FLOAT NOT NULL,
    perc FLOAT NOT NULL
);

CREATE TABLE ip (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL
);
