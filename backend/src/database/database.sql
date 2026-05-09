-- Eliminar tablas si existen para un reinicio limpio, en orden inverso de creación
DROP TABLE IF EXISTS Captura;
DROP TABLE IF EXISTS Lugares;
DROP TABLE IF EXISTS Personaje;
DROP TABLE IF EXISTS Usuario;

-- 1. Tabla: Usuario
-- Permite registrarse, guardar el progreso acumulado y generar el ranking.
CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    puntos INT DEFAULT 0            
);

-- 2. Tabla: Personaje
-- Almacena los modelos 3D y su valor base en puntos.
CREATE TABLE Personaje (
    id_personaje INT PRIMARY KEY AUTO_INCREMENT,
    nombre_personaje VARCHAR(50) NOT NULL,       -- Ej: 'Doctor', 'Ingeniero', 'Rector'
    ruta_modelo VARCHAR(255) NOT NULL,           -- Ruta de descarga del archivo 3D
    valor_puntos INT NOT NULL,                   -- Ej: 50 para normales, 500 para especiales
    es_especial BOOLEAN DEFAULT FALSE            -- TRUE para el Rector y símbolos, FALSE para facultades
);

-- 3. Tabla: Lugares
-- Define las facultades y qué dos personajes aparecen en cada una.
CREATE TABLE Lugares (
    id_lugar INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    id_personaje_1 INT NOT NULL, 
    id_personaje_2 INT NOT NULL,          
    FOREIGN KEY (id_personaje_1) REFERENCES Personaje(id_personaje) ON DELETE CASCADE,
    FOREIGN KEY (id_personaje_2) REFERENCES Personaje(id_personaje) ON DELETE CASCADE
);

-- 4. Tabla: Captura (Registro de la interacción)
-- Tabla puente que registra qué usuario capturó a qué personaje.
CREATE TABLE Captura (
    id_captura INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_personaje INT NOT NULL,
    puntos_obtenidos INT NOT NULL,
    fecha_captura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_personaje) REFERENCES Personaje(id_personaje) ON DELETE CASCADE,
    -- Restricción para que no capturen al mismo personaje dos veces 
    UNIQUE (id_usuario, id_personaje) 
);

-- DATOS DE MUESTRA --

-- Insertar Personajes de muestra
-- Asumimos rutas de modelos 3D de ejemplo
INSERT INTO Personaje (id_personaje, nombre_personaje, ruta_modelo, valor_puntos, es_especial) VALUES
(1, 'Ingeniero en Software', 'models/ingeniero.glb', 100, FALSE),
(2, 'Telematico', 'models/telematico.glb', 100, FALSE),
(3, 'Psicologo', 'models/psicologo.glb', 100, FALSE),
(4, 'Psicologa', 'models/psicologa.glb', 100, FALSE),
(5, 'Medico', 'models/medico.glb', 100, FALSE),
(6, 'Cirujana', 'models/cirujana.glb', 100, FALSE),
(7, 'Enfermero', 'models/enfermero.glb', 100, FALSE),
(8, 'Enfermera', 'models/enfermera.glb', 100, FALSE),
(9, 'Trabajador Social', 'models/trabajador_social.glb', 100, FALSE),
(10, 'Trabajadora Social', 'models/trabajadora_social.glb', 100, FALSE),
(11, 'Rector', 'models/rector.glb', 1000, TRUE),
(12, 'Loro', 'models/loro.glb', 500, TRUE),
(13, 'Estudiante de Intercambio', 'models/intercambio.glb', 100, FALSE),
(14, 'Lingüista', 'models/linguista.glb', 100, FALSE),
(15, 'Contador', 'models/contador.glb', 100, FALSE),
(16, 'Administradora', 'models/administradora.glb', 100, FALSE);


-- Insertar Lugares con sus coordenadas (centroide calculado) y personajes asignados
INSERT INTO Lugares (nombre, latitud, longitud, id_personaje_1, id_personaje_2) VALUES
('Facultad de Telematica', 19.249120, -103.697359, 1, 2),
('Facultad de Psicologia', 19.248551, -103.697227, 3, 4),
('Facultad de Medicina', 19.247356, -103.698054, 5, 6),
('Facultad de Enfermeria', 19.247707, -103.698578, 7, 8),
('Facultad de Trabajo Social', 19.248092, -103.698384, 9, 10),
('Rectoria', 19.248888, -103.698741, 11, 12),
('CEI', 19.249439, -103.698500, 13, 14),
('Servicios', 19.249608, -103.698995, 15, 16);

-- Insertar Usuarios de muestra
INSERT INTO Usuario (nombre_usuario, correo, contrasena, puntos) VALUES
('player1', 'player1@ucol.mx', '$2b$10$f9.VzV.' || 'some_dummy_hash_part2', 1250),
('player2', 'player2@ucol.mx', '$2b$10$f9.VzV.' || 'some_dummy_hash_part2', 980);

-- NOTA: Las contraseñas son solo un ejemplo y deben ser hasheadas correctamente en la aplicación real.
-- He añadido la columna 'puntos_obtenidos' a la tabla Captura para registrar el valor aleatorio exacto.
