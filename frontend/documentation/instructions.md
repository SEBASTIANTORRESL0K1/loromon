# Instrucciones para ejecutar el Frontend de Loromon

Este documento explica cómo configurar, ejecutar y depurar el frontend de `loromon` ubicado en `loromon/frontend`.

## Requisitos

- Node.js 18 o superior
- npm 10 o superior
- pnpm instalado opcionalmente (la carpeta contiene `pnpm-workspace.yaml`)
- Navegador moderno compatible con WebGL y geolocalización

## Instalación de dependencias

Desde la carpeta del frontend:

```bash
cd loromon/frontend
npm install
```

Si prefieres usar `pnpm`:

```bash
cd loromon/frontend
pnpm install
```

## Configuración de variables de entorno

El frontend utiliza variables de entorno Vite. Crea un archivo `.env` en la raíz de `loromon/frontend` si necesitas sobrescribir valores.

- `VITE_API_URL`: URL base del backend (por ejemplo `http://localhost:3001/api`).

Ejemplo de `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

## Ejecución en modo de desarrollo

Para iniciar la aplicación con recarga en caliente:

```bash
cd loromon/frontend
npm run dev
```

Luego abre la URL que muestra Vite en la consola, normalmente `http://localhost:5173`.

## Construcción para producción

Para generar los archivos optimizados de despliegue:

```bash
cd loromon/frontend
npm run build
```

Los archivos de salida se guardarán en `dist/`.

## Vista previa local de producción

Después de la compilación, puedes servir el frontend con un servidor estático, por ejemplo:

```bash
npx serve dist
```

## Estructura relevante del frontend

- `src/main.tsx`: punto de entrada que monta `App`.
- `src/app/App.tsx`: control principal de navegación y estado de la aplicación.
- `src/app/components/`: pantallas y UI específicas (`AuthScreen`, `MapScreen`, `ARCameraScreen`, `ProfileScreen`).
- `src/app/services/api.ts`: cliente HTTP hacia el backend.
- `src/app/hooks/useGeolocation.ts`: obtiene ubicación y calcula distancias.

## Notas importantes

- El frontend usa `VITE_API_URL` para conectar con el backend.
- El backend debe estar en ejecución y accesible desde esa URL.
- El navegador debe permitir geolocalización para usar la experiencia de mapa y captura.
- Si el backend usa CORS, asegúrate de que permita solicitudes desde `localhost:5173` u otra URL de desarrollo.
