# Loromon

API backend para un sistema de geolocalización y captura de personajes en la universidad. El proyecto expone endpoints para autenticación de usuarios, consulta de lugares y registro de capturas, usando Node.js, Express y MySQL.

## Descripción

Loromon es una API REST orientada a un juego de ubicación geográfica. Los usuarios pueden:

- registrarse e iniciar sesión
- consultar los lugares disponibles con sus coordenadas y personajes asociados
- capturar personajes y acumular puntos
- consultar el ranking global

## Tecnologías

- Node.js
- Express
- MySQL
- JWT para autenticación
- bcryptjs para contraseñas
- dotenv para variables de entorno

## Estructura del proyecto

```text
loromon/
├── backend/
│   ├── docs/
│   │   ├── database_diagram.md
│   │   ├── database_schema.md
│   │   └── endpoints/
│   │       ├── captura.md
│   │       ├── lugares.md
│   │       └── usuario.md
│   ├── src/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── routes/
│   │   ├── config.js
│   │   └── index.js
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   └── README.md
├── README.md
└── .gitignore
```

## Requisitos

- Node.js 18 o superior
- npm
- MySQL 8 o compatible
- Un cliente HTTP como Postman, Insomnia o curl

## Instalación

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd loromon/backend
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno. Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contrasena
DB_DATABASE=locations_db
DB_PORT=3306
JWT_SECRET=una_clave_secreta_segura
```

4. Crea la base de datos y ejecuta el esquema SQL ubicado en:

```text
backend/src/database/database.sql
```

5. Inicia la API:

```bash
npm run dev
```

La aplicación quedará disponible en:

```text
http://localhost:3000
```

## Scripts disponibles

En la carpeta `backend`:

```bash
npm start
```

Ejecuta la API en modo producción.

```bash
npm run dev
```

Ejecuta la API con nodemon para desarrollo.

## Endpoints principales

La API se monta bajo el prefijo `/api`.

### Usuarios

- `POST /api/usuarios/register` — registrar usuario
- `POST /api/usuarios/login` — iniciar sesión
- `GET /api/ranking` — ranking de usuarios

### Lugares

- `GET /api/lugares` — obtener lugares y personajes asociados

### Capturas

- `POST /api/capturar` — registrar la captura de un personaje

## Ejemplos de uso

### Registrar usuario

```bash
curl -X POST http://localhost:3000/api/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_usuario": "player1",
    "correo": "player1@ucol.mx",
    "contrasena": "123456"
  }'
```

### Iniciar sesión

```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "player1@ucol.mx",
    "contrasena": "123456"
  }'
```

### Obtener lugares

```bash
curl http://localhost:3000/api/lugares
```

### Capturar personaje

```bash
curl -X POST http://localhost:3000/api/capturar \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 1,
    "id_personaje": 5
  }'
```

## Documentación de endpoints

La documentación detallada está en:

- [backend/docs/endpoints/usuario.md](backend/docs/endpoints/usuario.md)
- [backend/docs/endpoints/captura.md](backend/docs/endpoints/captura.md)
- [backend/docs/endpoints/lugares.md](backend/docs/endpoints/lugares.md)

## Notas importantes

- Los datos de ejemplo del esquema incluyen usuarios, personajes y ubicaciones de muestra.
- La API usa JWT para autenticar sesiones.
- La lógica de captura usa una transacción en base de datos para evitar inconsistencias.
- La contraseña del usuario se guarda hasheada con bcrypt.

## Estado del proyecto

Proyecto backend funcional para gestionar usuarios, personajes y ubicaciones geográficas en un entorno de juego académico.

## Autor

Proyecto desarrollado como API para aplicación de geolocalización y gamificación universitaria.
