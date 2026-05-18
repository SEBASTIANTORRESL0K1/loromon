---
name: api-documenter
description: Automatiza la creación y actualización de documentación de endpoints de API en formato Markdown. Escanea el código fuente (src/), extrae URLs, métodos, cuerpos de petición y ejemplos de respuesta, y los organiza en la carpeta docs/.
---

# API Documenter Skill

Esta skill permite mantener la documentación técnica de la API sincronizada con el código fuente.

## Flujo de Trabajo

1. **Escaneo**: Analiza la carpeta `src/routes/` para identificar todos los endpoints disponibles.
2. **Análisis de Controladores**: Busca en `src/controllers/` la lógica asociada a cada ruta para inferir el formato del `body` y las respuestas exitosas/errores.
3. **Generación**: Crea o actualiza archivos `.md` en la carpeta `docs/`, agrupados por entidad (ej: `usuario.md`, `lugares.md`).

## Requisitos de Salida por Endpoint

Para cada endpoint identificado, la documentación DEBE incluir:
- **URL**: El endpoint completo (ej: `/api/usuarios/:id`).
- **Método**: GET, POST, PUT, DELETE, etc.
- **Body**: Descripción de los campos necesarios (si aplica) en formato JSON.
- **Ejemplo cURL**: Un comando listo para copiar y probar.
- **Ejemplo de Respuesta**: JSON de una respuesta exitosa (200/201) y posibles errores (400/404/500).

## Instrucciones para el Agente

- Al detectar cambios en los archivos de `src/`, activa esta skill para reflejar los cambios en `docs/`.
- Si la carpeta `docs/` no existe, créala.
- Asegúrate de que los ejemplos de cURL incluyan los encabezados necesarios (ej: `Content-Type: application/json`).
- Si encuentras middlewares de autenticación (ej: JWT), menciona que el endpoint requiere un token en el encabezado `Authorization`.

## Recursos
- Script de inicialización: `scripts/generate_docs.cjs`
