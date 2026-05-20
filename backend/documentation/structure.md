# Estructura del Backend de Loromon

Este documento describe la organización de carpetas y archivos del backend ubicado en `loromon/backend`.

## Raíz del backend

- `package.json`: dependencias y scripts del proyecto.
- `Dockerfile`: imagen para desplegar el backend en contenedores.
- `.env.example`: plantilla de variables de entorno.
- `README.md`: descripción general del backend.
- `docker-compose.yml` (si aplica): orquesta la aplicación con servicios como MySQL.
- `documentation/`: archivos de documentación del backend.
- `docs/`: documentación adicional de endpoints y base de datos.
- `src/`: código fuente principal.

## Carpeta `src/`

- `src/index.js`
  - punto de entrada del servidor.
  - configura middleware `cors` y `express.json()`.
  - sirve archivos estáticos desde `/models`.
  - monta las rutas bajo `/api`.
  - inicia la conexión a la base de datos y ejecuta la sincronización.

- `src/config.js`
  - carga variables de entorno con `dotenv`.
  - exporta constantes de configuración: `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `DB_PORT` y `JWT_SECRET`.

- `src/database/`
  - `db.js`: crea el pool de conexión MySQL usando `mysql2/promise`.
  - `sync.js`: sincroniza el esquema de base de datos ejecutando `database.sql`.
  - `database.sql`: script SQL para crear tablas y datos de muestra.

- `src/controllers/`
  - `usuario.controller.js`: lógica para registro, login y ranking.
  - `lugares.controller.js`: lógica para obtener lugares y personajes.
  - `captura.controller.js`: lógica para registrar capturas y consultar capturas por usuario.

- `src/routes/`
  - `usuario.routes.js`: rutas para usuarios y ranking.
  - `lugares.routes.js`: ruta para obtener lugares.
  - `captura.routes.js`: rutas para capturas y capturas por usuario.

- `src/modelos/`
  - carpeta con modelos 3D usados por el frontend.
  - se expone como archivos estáticos en la ruta `/models`.

## Flujo de ejecución

1. El servidor arranca desde `src/index.js`.
2. Se cargan variables de entorno desde `src/config.js`.
3. Se inicializa el pool de MySQL en `src/database/db.js`.
4. Se monta la API y se exponen rutas de los controladores.
5. Se intenta conectar a la base de datos y se sincroniza el esquema con `src/database/sync.js`.
6. El servidor queda escuchando en `PORT`.

## Dependencias clave

- `express`: servidor HTTP y enrutamiento.
- `cors`: habilita solicitudes CORS.
- `dotenv`: carga variables de entorno.
- `mysql2`: conexión a MySQL.
- `bcryptjs`: hash y validación de contraseñas.
- `jsonwebtoken`: generación de tokens JWT.
- `nodemon` (devDependency): reinicio automático en desarrollo.

## Notas de organización

- La lógica del negocio está separada en `controllers`.
- Las rutas solo conectan URL con controladores.
- La configuración de la base de datos está centralizada en `src/database`.
- Cualquier cambio en el esquema debe reflejarse en `src/database/database.sql`.
