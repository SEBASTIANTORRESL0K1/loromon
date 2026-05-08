CREATE DATABASE IF NOT EXISTS locations_db;

USE locations_db;

CREATE TABLE locations (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    category VARCHAR(50),
    createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

-- Datos de ejemplo (puedes reemplazarlos con los tuyos)
INSERT INTO locations (name, description, latitude, longitude, category) VALUES
('Biblioteca Central', 'Edificio principal de la biblioteca, cuenta con 3 pisos.', 19.332339, -99.185749, 'Edificio'),
('Cafetería "El Búho"', 'Cafetería principal cerca de la facultad de ingeniería.', 19.330699, -99.186933, 'Comida'),
('Canchas de Fútbol', 'Canchas de fútbol rápido y soccer.', 19.328835, -99.182283, 'Deporte');
