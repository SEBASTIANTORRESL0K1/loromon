# Esquema de la Base de Datos

Esta sección describe las tablas, campos y relaciones de la base de datos `loromon_db`.

## Tablas

### 1. Usuario
Almacena la información de los jugadores y su progreso.
- `id_usuario` (INT, PK, AI): Identificador único del usuario.
- `nombre_usuario` (VARCHAR(50), UNIQUE): Nombre público del jugador.
- `correo` (VARCHAR(100), UNIQUE): Correo electrónico.
- `contrasena` (VARCHAR(255)): Hash de la contraseña.
- `puntos` (INT, DEFAULT 0): Puntaje acumulado por capturas.

### 2. Personaje
Catálogo de personajes (Pokemones) disponibles en el juego.
- `id_personaje` (INT, PK, AI): Identificador único del personaje.
- `nombre_personaje` (VARCHAR(50)): Nombre del personaje (ej: 'Ingeniero').
- `ruta_modelo` (VARCHAR(255)): Ruta al archivo 3D (.glb).
- `valor_puntos` (INT): Puntos base que otorga al ser capturado.
- `es_especial` (BOOLEAN): Indica si es un personaje raro o especial.

### 3. Lugares
Ubicaciones geográficas donde aparecen los personajes.
- `id_lugar` (INT, PK, AI): Identificador único del lugar.
- `nombre` (VARCHAR(100), UNIQUE): Nombre de la facultad o punto de interés.
- `latitud` (DECIMAL(10, 8)): Coordenada de latitud.
- `longitud` (DECIMAL(11, 8)): Coordenada de longitud.
- `id_personaje_1` (INT, FK): Primer personaje asignado al lugar.
- `id_personaje_2` (INT, FK): Segundo personaje asignado al lugar.

### 4. Captura
Registro histórico de las capturas realizadas por los usuarios.
- `id_captura` (INT, PK, AI): Identificador único de la captura.
- `id_usuario` (INT, FK): Usuario que realizó la captura.
- `id_personaje` (INT, FK): Personaje capturado.
- `puntos_obtenidos` (INT): Puntos totales otorgados (Base + Aleatorio).
- `fecha_captura` (TIMESTAMP): Fecha y hora del evento.

## Relaciones

- **Lugares -> Personaje**: Un lugar referencia a dos personajes mediante llaves foráneas (`id_personaje_1`, `id_personaje_2`).
- **Captura -> Usuario**: Una captura pertenece a un único usuario (Relación 1:N).
- **Captura -> Personaje**: Una captura involucra a un único personaje (Relación 1:N).
- **Restricción Unique (id_usuario, id_personaje)**: Un usuario solo puede capturar cada personaje una sola vez.
