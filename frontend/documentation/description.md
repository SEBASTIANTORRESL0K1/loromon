# Descripción del Frontend de Loromon

Este documento describe la aplicación frontend de `loromon`, ubicada en `loromon/frontend`.

## Resumen

El frontend es una aplicación web construida con:
- React 18
- Vite
- TypeScript
- Material UI (`@mui/material`)
- React Three Fiber y `three` para renderizado 3D
- Leaflet para mapas interactivos
- Sonner para notificaciones

La aplicación está diseñada para funcionar como una experiencia tipo juego de campo: el usuario se autentica, ve un mapa con lugares, abre una cámara AR para capturar personajes y revisa su perfil y puntaje.

## Estructura principal

- `package.json`: dependencias del proyecto y scripts de construcción.
- `tsconfig.json`: configuración de TypeScript.
- `vite.config.ts`: configuración de Vite.
- `src/main.tsx`: punto de entrada que renderiza el componente `App`.
- `src/styles/`: estilos globales y utilidades CSS.

## Arquitectura de la aplicación

### `src/app/App.tsx`

- Punto central de la aplicación.
- Gestiona el estado de la pantalla actual:
  - `auth`
  - `map`
  - `camera`
  - `profile`
- Maneja la sesión del usuario con `localStorage`.
- Controla la navegación inferior y la transición entre pantallas.
- Sincroniza los puntos del usuario con el backend.
- Aplica el tema de Material UI y el estilo global.

### `src/app/components/`

Componentes principales de la interfaz:
- `AuthScreen.tsx`: pantalla de autenticación y registro.
- `MapScreen.tsx`: muestra el mapa, los lugares y las acciones de captura.
- `ARCameraScreen.tsx`: interfaz de captura de personaje en modo cámara/AR.
- `ProfileScreen.tsx`: vista de perfil y detalles del usuario.

### `src/app/services/api.ts`

- Contiene las funciones de acceso a la API del backend.
- Define tipos TypeScript para `Usuario`, `Lugar`, `Personaje` y los datos de autenticación.
- Maneja la configuración de los headers y el envío del token JWT almacenado en `localStorage`.
- Exporta métodos:
  - `register`
  - `login`
  - `getLugares`
  - `capturar`
  - `getRanking`
  - `getInventario`

### `src/app/hooks/useGeolocation.ts`

- Obtiene la ubicación del usuario con la API de geolocalización del navegador.
- Actualiza la ubicación cada 2 minutos por defecto.
- Gestiona errores de permiso, tiempo de espera y datos inválidos.
- Proporciona una función `calculateDistance` para medir distancias entre coordenadas.

## Integración con el backend

- El frontend usa la variable de entorno `VITE_API_URL` para construir la URL de la API.
- Consume los endpoints:
  - `/api/usuarios/register`
  - `/api/usuarios/login`
  - `/api/ranking`
  - `/api/lugares`
  - `/api/capturar`
  - `/api/usuario/:id_usuario`
- Maneja la autorización con el token JWT devuelto por `login`.

## Experiencia de usuario

- El usuario inicia sesión o se registra.
- Al autenticarse, se muestra el mapa con lugares geolocalizados.
- El usuario puede abrir la cámara AR para capturar personajes asociados a un lugar.
- Las capturas actualizan el puntaje y el ranking.
- Hay una pantalla de perfil con la posibilidad de cerrar sesión.

## Dependencias relevantes

- `react`, `react-dom`: base de la aplicación.
- `@vitejs/plugin-react`: integración React con Vite.
- `@mui/material`, `@mui/icons-material`: componentes UI.
- `@react-three/fiber`, `three`, `@react-three/drei`: renderizado 3D.
- `leaflet`, `react-leaflet`: mapas interactivos.
- `sonner`: notificaciones.
- `react-router` (incluido, aunque la aplicación usa navegación condicional en `App.tsx`).
- `tailwindcss`, `@tailwindcss/vite`: utilidades de estilo.

## Observaciones

- La aplicación no usa rutas basadas en URL; la navegación se maneja desde el estado interno de `App.tsx`.
- El archivo `src/app/services/api.ts` centraliza la comunicación con el backend y los tipos compartidos.
- Las rutas estáticas de modelos 3D se consumen desde el backend en `/models`.
- La configuración de la API se obtiene a través de `import.meta.env.VITE_API_URL`.
