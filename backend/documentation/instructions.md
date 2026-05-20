# Instrucciones para ejecutar el Backend de Loromon

Este documento explica cómo instalar, configurar y ejecutar el backend ubicado en `loromon/backend`.

## Requisitos

- Node.js 18 o superior
- npm 10 o superior
- Docker y Docker Compose (opcional, recomendado para entornos locales aislados)
- MySQL (si no usas Docker)

## Configuración del entorno

1. Copia el archivo de ejemplo de variables de entorno:

```bash
cd loromon/backend
copy .env.example .env
```

2. Edita el archivo `.env` con los valores adecuados:

- `PORT`: puerto en el que correrá la API.
- `DB_DATABASE`: nombre de la base de datos.
- `DB_USER` y `DB_PASSWORD`: credenciales de MySQL.
- `DB_HOST`: host de la base de datos (por defecto `localhost`).
- `DB_PORT`: puerto de MySQL (por defecto `3306`).
- `JWT_SECRET`: clave secreta para la generación de tokens.

> Si despliegas en un servicio como Railway, también puedes usar la variable `MYSQL_URL` o `DATABASE_URL` para la conexión completa.

## Instalación de dependencias

Desde la carpeta del backend:

```bash
cd loromon/backend
npm install
```

## Ejecución en modo de desarrollo

Para iniciar el servidor con reinicio automático al cambiar archivos:

```bash
npm run dev
```

## Ejecución en modo de producción

Para iniciar el servidor en modo normal:

```bash
npm start
```

## Conexión a la base de datos

El backend utiliza MySQL y puede conectarse de dos maneras:

1. Con variables individuales (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`, `DB_PORT`).
2. Con una URL completa de conexión en `MYSQL_URL` o `DATABASE_URL`.

El servidor intentará conectarse a la base de datos al arrancar y ejecutará `src/database/sync.js` para sincronizar las tablas y datos.

## Uso con Docker Compose

Si quieres levantar la API junto con MySQL en contenedores:

```bash
docker-compose up --build
```

Para detener los contenedores:

```bash
docker-compose down
```

Si deseas reiniciar completamente el servicio y eliminar volúmenes de datos:

```bash
docker-compose down -v
```

## Endpoints disponibles

- `POST /api/usuarios/register`: registrar un usuario.
- `POST /api/usuarios/login`: iniciar sesión.
- `GET /api/ranking`: obtener ranking de puntajes.
- `GET /api/lugares`: obtener lugares con personajes.
- `POST /api/capturar`: registrar captura de personaje.
- `GET /api/usuario/:id_usuario`: ver capturas de un usuario.

## Notas importantes

- El archivo `src/database/database.sql` se ejecuta al iniciar el servidor, por lo que en cada arranque se pueden recrear las tablas y datos de ejemplo.
- El endpoint de captura actualmente acepta `id_usuario` en el body de la petición.
- Los modelos 3D se sirven desde `/models`.
