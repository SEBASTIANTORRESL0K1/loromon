# API Loromon

Backend en Node.js + Express para una aplicación de geolocalización y captura de personajes en la universidad.

## Objetivo

La API permite:

- registrar usuarios
- autenticar sesiones con JWT
- consultar lugares con coordenadas y personajes asociados
- registrar capturas de personajes
- calcular puntos y mostrar ranking

## Stack

- Node.js
- Express
- MySQL
- JWT
- bcryptjs
- dotenv

## Estructura

```text
backend/
├── docs/
│   ├── database_diagram.md
│   ├── database_schema.md
│   └── endpoints/
│       ├── captura.md
│       ├── lugares.md
│       └── usuario.md
├── src/
│   ├── controllers/
│   │   ├── captura.controller.js
│   │   ├── lugares.controller.js
│   │   └── usuario.controller.js
│   ├── database/
│   │   ├── database.sql
│   │   └── db.js
│   ├── routes/
│   │   ├── captura.routes.js
│   │   ├── lugares.routes.js
│   │   └── usuario.routes.js
│   ├── config.js
│   └── index.js
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
└── .env
```

## Requisitos previos

- Node.js 18+
- npm
- MySQL Server
- Base de datos creada con el esquema SQL

## Instalación

1. Entra al directorio del backend:

```bash
cd backend
```

2. Instala dependencias:

```bash
npm install
```

3. Crea un archivo `.env` con la siguiente configuración:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_DATABASE=locations_db
DB_PORT=3306
JWT_SECRET=tu_clave_secreta
```

4. Importa la base de datos desde el archivo SQL:

```bash
mysql -u root -p < src/database/database.sql
```

5. Ejecuta la aplicación:

```bash
npm run dev
```

## Endpoints principales

### Autenticación

- `POST /api/usuarios/register`
- `POST /api/usuarios/login`
- `GET /api/ranking`

### Lugares

- `GET /api/lugares`

### Capturas

- `POST /api/capturar`

## Ejemplos

### Registro

```bash
curl -X POST http://localhost:3000/api/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_usuario": "ash",
    "correo": "ash@ucol.mx",
    "contrasena": "123456"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{
    "correo": "ash@ucol.mx",
    "contrasena": "123456"
  }'
```

### Ranking

```bash
curl http://localhost:3000/api/ranking
```

### Captura de personaje

```bash
curl -X POST http://localhost:3000/api/capturar \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 1,
    "id_personaje": 2
  }'
```

## Documentación adicional

- [docs/endpoints/usuario.md](docs/endpoints/usuario.md)
- [docs/endpoints/captura.md](docs/endpoints/captura.md)
- [docs/endpoints/lugares.md](docs/endpoints/lugares.md)

## Consideraciones

- La base de datos tiene datos de ejemplo para pruebas.
- La contraseña se almacena en formato hash con bcrypt.
- La captura de personajes valida duplicados y usa transacción para mantener integridad.

## Inicio rápido

```bash
npm install
npm run dev
```

El servidor quedará escuchando en el puerto configurado en `.env`.
