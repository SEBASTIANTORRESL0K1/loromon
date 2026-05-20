# Documentación de la Base de Datos del Backend de Loromon

Este documento describe el modelo de datos, las tablas, las relaciones y el comportamiento de la base de datos utilizada por el backend de `loromon`.

## Arquitectura de la base de datos

La base de datos es MySQL y se define principalmente en el archivo `src/database/database.sql`.

### Tablas principales

#### Usuario
- `id_usuario` INT PRIMARY KEY AUTO_INCREMENT
- `nombre_usuario` VARCHAR(50) NOT NULL UNIQUE
- `correo` VARCHAR(100) UNIQUE NOT NULL
- `contrasena` VARCHAR(255) NOT NULL
- `puntos` INT DEFAULT 0

Función: almacena las cuentas de los jugadores, sus credenciales hash y su total de puntos.

#### Personaje
- `id_personaje` INT PRIMARY KEY AUTO_INCREMENT
- `nombre_personaje` VARCHAR(50) NOT NULL
- `ruta_modelo` VARCHAR(255) NOT NULL
- `valor_puntos` INT NOT NULL
- `es_especial` BOOLEAN DEFAULT FALSE

Función: contiene los personajes que pueden aparecer en los lugares y ser capturados. `ruta_modelo` apunta a la ruta del archivo 3D dentro del servidor.

#### Lugares
- `id_lugar` INT PRIMARY KEY AUTO_INCREMENT
- `nombre` VARCHAR(100) NOT NULL UNIQUE
- `latitud` DECIMAL(10, 8) NOT NULL
- `longitud` DECIMAL(11, 8) NOT NULL
- `id_personaje_1` INT NOT NULL
- `id_personaje_2` INT NOT NULL
- `FOREIGN KEY (id_personaje_1) REFERENCES Personaje(id_personaje) ON DELETE CASCADE`
- `FOREIGN KEY (id_personaje_2) REFERENCES Personaje(id_personaje) ON DELETE CASCADE`

Función: define los puntos de interés georreferenciados y los dos personajes asignados a cada lugar.

#### Captura
- `id_captura` INT PRIMARY KEY AUTO_INCREMENT
- `id_usuario` INT NOT NULL
- `id_personaje` INT NOT NULL
- `puntos_obtenidos` INT NOT NULL
- `fecha_captura` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario) ON DELETE CASCADE`
- `FOREIGN KEY (id_personaje) REFERENCES Personaje(id_personaje) ON DELETE CASCADE`
- `UNIQUE (id_usuario, id_personaje)`

Función: registra cada captura de personaje por usuario y el puntaje obtenido. La restricción UNIQUE impide que un mismo usuario capture el mismo personaje varias veces.

## Relaciones entre tablas

- `Lugares` se relaciona con `Personaje` mediante dos claves foráneas: `id_personaje_1` y `id_personaje_2`.
- `Captura` relaciona `Usuario` y `Personaje`, formando una tabla puente con información adicional de puntaje y fecha.

## Flujo de sincronización

Al iniciar `src/index.js`, el servidor llama a `syncDatabase()` desde `src/database/sync.js`.

- `syncDatabase()` lee `src/database/database.sql`.
- Ejecuta el SQL completo usando `multipleStatements=true`.
- El script recrea las tablas y carga datos de ejemplo.

> Nota: este enfoque reinicia las tablas cada vez que la aplicación arranca, por lo que no está recomendado para entornos de producción con datos persistentes sin antes ajustar el comportamiento.

## Datos de ejemplo incluidos

El script `src/database/database.sql` incluye datos de muestra para:
- varios `Personaje` con rutas de modelos 3D y valores de puntos
- `Lugares` con coordenadas y personajes vinculados
- usuarios de ejemplo en `Usuario`

## Observaciones importantes

- `Usuario.puntos` se actualiza en cada captura exitosa.
- `Captura.puntos_obtenidos` guarda el puntaje real obtenido en la captura, que incluye el valor base del personaje más un componente aleatorio.
- Las rutas de modelos en `Personaje.ruta_modelo` deben ser compatibles con la carpeta estática expuesta en `/models`.
- Si un `Personaje` es eliminado, los `Lugares` y `Captura` relacionados se eliminarán automáticamente por `ON DELETE CASCADE`.

## Recomendaciones

- Para un despliegue real, no ejecutar automáticamente `database.sql` en cada inicio.
- Usar migraciones o un script de inicialización separado si se desea preservar datos.
- Asegurar que `JWT_SECRET` esté configurado y que las contraseñas no se almacenen en texto plano.
