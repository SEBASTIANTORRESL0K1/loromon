# Estructura del Frontend de Loromon

Este documento describe la organización de carpetas y archivos del frontend en `loromon/frontend`.

## Raíz del frontend

- `package.json`: dependencias y scripts para ejecutar, desarrollar y construir la app.
- `pnpm-workspace.yaml`: configuración de workspace si se usa `pnpm`.
- `tsconfig.json`: configuración de TypeScript.
- `vite.config.ts`: configuración del bundler Vite.
- `README.md`: documentación general del frontend.
- `documentation/`: documentación específica del frontend.
- `src/`: todo el código fuente de la aplicación.
- `public/` o `assets/`: activos estáticos y recursos públicos (dependiendo de la estructura del proyecto).

## Carpeta `src/`

- `src/main.tsx`
  - punto de entrada de la aplicación.
  - monta el componente `App` en el DOM.

- `src/app/App.tsx`
  - componente raíz que controla la navegación entre pantallas.
  - gestiona el estado del usuario y la vista actual (`auth`, `map`, `camera`, `profile`).
  - aplica el tema de Material UI y renderiza la navegación inferior.

- `src/app/components/`
  - componentes principales de las vistas:
    - `AuthScreen.tsx`
    - `MapScreen.tsx`
    - `ARCameraScreen.tsx`
    - `ProfileScreen.tsx`
  - cada componente representa una pantalla o sección de la app.

- `src/app/services/api.ts`
  - cliente HTTP para comunicarse con el backend.
  - define tipos de datos (`Usuario`, `Lugar`, `Personaje`, etc.).
  - implementa funciones como `login`, `register`, `getLugares`, `capturar`, `getRanking` y `getInventario`.

- `src/app/hooks/useGeolocation.ts`
  - hook personalizado para obtener la ubicación del usuario.
  - calcula distancias y actualiza la posición periódicamente.

- `src/styles/`
  - contiene estilos globales y configuraciones CSS.
  - incluye archivos como `index.css`.

## Flujo de la aplicación

1. `src/main.tsx` inicia la app y monta `App`.
2. `App.tsx` determina si el usuario está autenticado y muestra la pantalla adecuada.
3. `AuthScreen` gestiona el login/registro.
4. `MapScreen` carga lugares desde el backend y muestra el mapa.
5. `ARCameraScreen` permite capturar personajes.
6. `ProfileScreen` muestra información del usuario y permite cerrar sesión.

## Configuración de rutas y navegación

- No hay una estructura de rutas basada en URL en el código principal.
- La navegación se controla con el estado interno de `App.tsx` y un `BottomNavigation` de Material UI.

## Dependencias del frontend

- React y React DOM para la UI.
- Material UI para componentes visuales.
- Vite para desarrollo y build.
- TypeScript para tipado estático.
- Leaflet / React Leaflet para mapas.
- Three.js / React Three Fiber para escenas 3D.

## Observaciones

- `src/app/services/api.ts` es el punto central para la comunicación con el backend.
- `src/app/hooks/useGeolocation.ts` abstrae la lógica de geolocalización.
- La estructura separa claramente vistas (`components`), servicios (`services`) y hooks (`hooks`).
- Los archivos estáticos de modelos 3D se consumen desde el backend en `/models`.
