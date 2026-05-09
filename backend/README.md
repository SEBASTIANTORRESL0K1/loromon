Hola, bienvenido a tu API de Geolocalización.

Este es un proyecto de Node.js y Express diseñado para ser desplegado fácilmente en Railway.

## Estructura

- `src/`: Contiene todo el código fuente.
  - `controllers/`: Lógica de negocio.
  - `database/`: Conexión a BD y scripts SQL.
  - `routes/`: Definición de las rutas de la API.
  - `index.js`: Punto de entrada de la aplicación.
  - `config.js`: Manejo de variables de entorno.
- `Dockerfile`: Define el contenedor para producción.
- `.env.example`: Plantilla de las variables de entorno necesarias.

## Cómo empezar

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Configurar variables de entorno:**
    - Renombra `.env.example` a `.env`.
    - Rellena las variables con tus credenciales de la base de datos. Railway te las proporcionará automáticamente en el entorno de despliegue.

3.  **Ejecutar en modo de desarrollo:**
    ```bash
    npm run dev
    ```

El servidor se iniciará en el puerto especificado (por defecto, 3000).
