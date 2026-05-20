# Documentación del Backend de Loromon

Este archivo documenta el backend de `loromon` ubicado en `loromon/backend`.

## Resumen

El backend es una API REST construida con Node.js y Express para manejar:
- registro e inicio de sesión de usuarios
- ranking de jugadores
- consulta de lugares con personajes asociados
- registro de capturas de personajes
- seguimiento de puntos de los usuarios

La base de datos es MySQL y se sincroniza automáticamente al iniciar la aplicación usando `src/database/sync.js` y el script `src/database/database.sql`.

## Estructura principal

- `src/index.js`
  - crea el servidor Express
  - configura middlewares: `cors` y `express.json()`
  - expone archivos estáticos en `/models`
  - monta rutas bajo `/api`
  - realiza conexión a la base de datos y sincroniza el esquema

- `src/config.js`
  - carga variables de entorno con `dotenv`
  - expone variables de configuración para el puerto y la conexión a MySQL
  - incluye `JWT_SECRET` para la generación de tokens

- `src/database/db.js`
  - crea el pool de conexión a MySQL usando `mysql2/promise`
  - acepta una URL de conexión completa (`MYSQL_URL` o `DATABASE_URL`) o variables individuales de host/usuario/contraseña

- `src/database/sync.js`
  - ejecuta el contenido de `src/database/database.sql`
  - recrea tablas y datos de ejemplo si es necesario

- `src/controllers/`
  - `usuario.controller.js`: registra, autentica usuarios y calcula el ranking
  - `lugares.controller.js`: obtiene lugares con personajes asociados
  - `captura.controller.js`: registra capturas y obtiene capturas por usuario

- `src/routes/`
  - define las rutas y vincula controladores

## Variables de entorno importantes

- `PORT`: puerto donde se ejecuta el backend
- `DB_DATABASE`: nombre de la base de datos MySQL
- `DB_USER`: usuario MySQL
- `DB_PASSWORD`: contraseña MySQL
- `DB_HOST`: host de MySQL (por defecto `localhost`)
- `DB_PORT`: puerto de MySQL (por defecto `3306`)
- `JWT_SECRET`: clave secreta para firmar JWT
- `MYSQL_URL` / `DATABASE_URL`: URL de conexión completa a la base de datos (utilizada en entornos como Railway)

## Endpoints principales

### Usuarios

- `POST /api/usuarios/register`
  - Registra un nuevo usuario.
  - Body: `nombre_usuario`, `correo`, `contrasena`
  - Respuestas:
    - `201 Created`: usuario registrado
    - `400 Bad Request`: faltan datos
    - `409 Conflict`: nombre o correo ya existe

- `POST /api/usuarios/login`
  - Inicia sesión y genera un token JWT.
  - Body: `correo`, `contrasena`
  - Respuestas:
    - `200 OK`: login exitoso con token
    - `401 Unauthorized`: credenciales inválidas
    - `500 Internal Server Error`: error interno

- `GET /api/ranking`
  - Retorna los mejores 100 usuarios ordenados por puntos.
  - Respuestas:
    - `200 OK`: lista de usuarios
    - `500 Internal Server Error`: error interno

### Lugares

- `GET /api/lugares`
  - Obtiene todos los lugares con sus dos personajes asociados.
  - Respuestas:
    - `200 OK`: lista de lugares
    - `500 Internal Server Error`: error interno

### Capturas

- `POST /api/capturar`
  - Registra la captura de un personaje por parte de un usuario.
  - Body: `id_usuario`, `id_personaje`
  - Respuestas:
    - `201 Created`: captura registrada
    - `400 Bad Request`: faltan datos
    - `404 Not Found`: personaje no existe
    - `409 Conflict`: personaje ya capturado
    - `500 Internal Server Error`: error interno

- `GET /api/usuario/:id_usuario`
  - Obtiene los personajes capturados por un usuario.
  - Respuestas:
    - `200 OK`: capturas del usuario
    - `400 Bad Request`: falta el ID del usuario
    - `500 Internal Server Error`: error interno

## Modelo de datos

El esquema de base de datos definido en `src/database/database.sql` incluye:

- `Usuario`
  - `id_usuario`, `nombre_usuario`, `correo`, `contrasena`, `puntos`

- `Personaje`
  - `id_personaje`, `nombre_personaje`, `ruta_modelo`, `valor_puntos`, `es_especial`

- `Lugares`
  - `id_lugar`, `nombre`, `latitud`, `longitud`, `id_personaje_1`, `id_personaje_2`

- `Captura`
  - `id_captura`, `id_usuario`, `id_personaje`, `puntos_obtenidos`, `fecha_captura`

## Notas adicionales

- El backend actualmente recibe `id_usuario` desde el cuerpo de la petición en `/api/capturar`, en lugar de extraerlo del JWT.
- Los modelos 3D se sirven como archivos estáticos desde `/models`.
- El proceso de sincronización de base de datos reinicia las tablas al iniciar el servidor, así que usarlo con cuidado en entornos con datos reales.
