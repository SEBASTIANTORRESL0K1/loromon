# 🦜 LoroMon - Juego WebAR

LoroMon es una aplicación web de realidad aumentada (AR) donde los usuarios pueden explorar su facultad, localizar personajes "LoroMon" en un mapa interactivo y capturarlos usando la cámara de su dispositivo.

## 🚀 Características
- **Autenticación segura**: registro e inicio de sesión integrados con el servidor de LoroMon.
- **Mapa en tiempo real**: visualización de facultades y puntos de interés (próximamente con Leaflet).
- **Captura AR**: experiencia interactiva de captura de personajes en 3D (simulado/WebAR).
- **Ranking y perfil**: seguimiento de puntos y competencia con otros entrenadores.

## 🛠️ Tecnologías utilizadas
- **Frontend**: React + TypeScript + Vite.
- **Interfaz de usuario (UI)**: Material UI (MUI).
- **Comunicación API**: Fetch API + Sonner (notificaciones).
- **Estilos**: Emotion + CSS moderno.

## 📋 Requisitos previos
Asegúrate de tener instalado:
- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- npm (viene incluido con Node.js)

## 🔧 Instalación y configuración

1.  **Clonar el repositorio**:
    ```bash
    git clone <url-del-repositorio>
    cd "WebAR App Design"
    ```

2.  **Instalar dependencias**:
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**:
    Crea un archivo `.env` en la raíz del proyecto y añade la dirección de la API:
    ```env
    VITE_API_URL=/api
    ```

4.  **Iniciar el servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173`.

## 📁 Estructura del proyecto
- `src/app/components`: pantallas y componentes principales de la aplicación.
- `src/app/services`: lógica de conexión con la API.
- `docs/`: documentación de los puntos finales (endpoints) y base de datos proporcionada por el equipo de desarrollo del servidor.
- `.env`: configuración de variables de entorno (no incluido en el repositorio).

## 🛡️ Seguridad
El proyecto incluye validaciones de entrada, protección contra inyección de scripts (XSS) básico y manejo seguro de sesiones mediante `localStorage`.

---
*Desarrollado para el proyecto LoroMon - 2026*
