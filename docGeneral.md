# Documentación general de Loromon

Loromon es un proyecto de realidad aumentada y geolocalización para la facultad, compuesto por un backend en Node.js/Express y un frontend en React/Vite.

## Propósito

El proyecto crea una experiencia de juego donde los usuarios pueden:
- registrarse e iniciar sesión
- ver lugares georreferenciados en un mapa
- capturar personajes asociados a esos lugares
- acumular puntos y competir en un ranking
- revisar su perfil y su inventario de capturas

## Componentes principales

### Backend (`loromon/backend`)

- Servidor REST con Express.
- Base de datos MySQL para usuarios, personajes, lugares y capturas.
- Autenticación con JWT.
- Sincronización del esquema mediante un script SQL.
- Endpoints para usuarios, ranking, lugares y capturas.

### Frontend (`loromon/frontend`)

- Aplicación web con React y Vite.
- UI construida con Material UI.
- Mapas interactivos con Leaflet.
- Renderizado 3D con Three.js y React Three Fiber.
- Geolocalización del navegador para experiencia de juego basada en ubicación.
- Comunicación con el backend mediante fetch y un cliente API centralizado.

## Estructura del repositorio

- `loromon/backend`: código y documentación del backend.
- `loromon/frontend`: código y documentación del frontend.
- `README.md`: documentación general del proyecto.
- `docGeneral.md`: este resumen de alto nivel.

## Flujo básico

1. El usuario se registra o inicia sesión en el frontend.
2. El frontend obtiene lugares desde el backend.
3. El usuario interactúa con el mapa y captura personajes.
4. Cada captura actualiza el puntaje en el backend.
5. El ranking se consulta desde el backend y se muestra en el frontend.

## Consideraciones

- El proyecto está pensado para ejecutarse en desarrollo con Node.js y Vite.
- El backend puede correr localmente con Docker o una instalación de MySQL.
- El frontend depende de una variable de entorno `VITE_API_URL` para conectar con la API.
- La documentación específica del frontend y backend se encuentra dentro de `loromon/frontend/documentation` y `loromon/backend/documentation`.

## Estado actual

- Backend: API REST operativa con rutas para usuarios, lugares y capturas.
- Frontend: aplicación de usuario con autenticación, mapa, cámara AR y perfil.
- Base de datos: modelo relacional con tablas para usuario, personaje, lugar y captura.

## Cómo usar esta documentación

Este archivo es una referencia rápida del proyecto. Para detalles técnicos y pasos de ejecución, revisa:
- `loromon/backend/documentation/instructions.md`
- `loromon/backend/documentation/description.md`
- `loromon/backend/documentation/bdDoc.md`
- `loromon/frontend/documentation/instructions.md`
- `loromon/frontend/documentation/description.md`
- `loromon/frontend/documentation/stack.md`
- `loromon/frontend/documentation/structure.md`
