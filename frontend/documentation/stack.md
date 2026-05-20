# Stack del Frontend de Loromon

Esta aplicación frontend utiliza una combinación de tecnologías modernas para ofrecer una experiencia interactiva, basada en mapas y AR.

## Frameworks y librerías principales

- React 18: biblioteca principal para construir la interfaz de usuario.
- Vite: herramienta de construcción y bundling que brinda desarrollo rápido y recarga instantánea.
- TypeScript: tipado estático para mayor seguridad y autocompletado.

## UI y estilo

- Material UI (`@mui/material`): componentes de interfaz de usuario listos para usar.
- MUI Icons (`@mui/icons-material`): iconografía para la navegación y botones.
- Tailwind CSS (`tailwindcss`, `@tailwindcss/vite`): utilidades CSS para estilos rápidos y consistentes.
- `sonner`: notificaciones visuales.
- `clsx` y `class-variance-authority`: gestión de clases y variantes CSS.

## Mapas y geolocalización

- Leaflet (`leaflet`): librería de mapas interactivos.
- React Leaflet (`react-leaflet`): integración de Leaflet con React.
- `@types/leaflet`: tipos de TypeScript para Leaflet.
- API de geolocalización del navegador: obtiene la ubicación del usuario.

## 3D y experiencia visual

- Three.js (`three`): motor 3D para renderizar modelos.
- React Three Fiber (`@react-three/fiber`): renderizado 3D declarativo en React.
- Drei (`@react-three/drei`): utilidades para Three.js dentro de React.
- `react-slick`, `embla-carousel-react`, `react-responsive-masonry`: componentes para carruseles y diseño responsivo.

## Estado, formularios y rutas

- React Hook Form (`react-hook-form`): manejo de formularios y validación.
- React Router (`react-router`): aunque la navegación principal se gestiona en estado local, está disponible para rutas si se extiende.
- `useState` y `useEffect`: hooks internos de React para estado y efectos.

## Utilidades y misc.

- `date-fns`: manejo de fechas.
- `lucide-react`: iconos adicionales.
- `next-themes`: soporte de temas claros/oscuros si se requiere.
- `react-dnd`, `react-dnd-html5-backend`: arrastrar y soltar.
- `react-popper`: posicionamiento de popovers.
- `react-resizable-panels`: paneles redimensionables.
- `react-day-picker`: selección de fechas.
- `canvas-confetti`: efectos visuales de celebración.

## Construcción y desarrollo

- Vite (`vite`): bundler y servidor de desarrollo.
- Plugin React para Vite (`@vitejs/plugin-react`).
- `typescript`: compilador de TypeScript.
- `@types/node`, `@types/react`, `@types/react-dom`: tipos para TypeScript.

## Comunicación con el backend

- Fetch API nativa del navegador: utilizada desde `src/app/services/api.ts`.
- Variables de entorno Vite (`VITE_API_URL`): define la URL base del backend.

## Observaciones

- El frontend mezcla componentes visuales de Material UI con mapas Leaflet y escenas 3D de Three.js.
- El proyecto está preparado para desarrollo rápido con Vite y para despliegue con una build optimizada.
