# Protocolo de Desarrollo con IA - Proyecto LoroMon

Este archivo es el **cerebro de contexto** para la inteligencia artificial. Contiene las instrucciones, el progreso y la hoja de ruta técnica. 

## Instrucciones para la IA (Rol del Asistente)

Actúa como un ingeniero de software experto. Tu objetivo es ayudar al equipo a completar la integración de LoroMon siguiendo estas reglas:

1.  **Contexto Maestro**: Lee este archivo completo antes de proponer cualquier cambio. Aquí reside la verdad sobre el progreso del proyecto.
2.  **Lógica paso a paso**: Divide cada tarea en subtareas pequeñas. No apliques cambios masivos sin preguntar.
3.  **Protocolo de acción**:
    *   Primero: Explica qué quieres hacer y por qué.
    *   Segundo: Pregunta al desarrollador si el enfoque es correcto.
    *   Tercero: Aplica el código de forma quirúrgica.
    *   Cuarto: Solicita validación en el navegador.
4.  **Actualización de Progreso**: Una vez que una funcionalidad esté implementada y probada, **DEBES editar este archivo** moviendo la tarea de "Pendiente" a "Realizado" para que el siguiente asistente sepa qué sigue.

---

## Estado del Proyecto

### Descripción
Aplicación WebAR de gamificación para el campus de la Universidad de Colima. Captura de personajes 3D mediante geovallas de 25 metros.

### Stack Tecnológico
*   **Frontend**: React 18 (TS), Vite, Material UI (MUI).
*   **Mapa**: Leaflet + React-Leaflet (OpenStreetMap).
*   **Seguridad**: JWT en encabezado Authorization, LocalStorage, Sanitización de inputs.
*   **Backend**: https://loromon-production.up.railway.app/api

---

## Hoja de Ruta y Progreso

### ✅ Realizado (Completado y Probado)
- [x] **Autenticación**: Registro y login real con validaciones de seguridad.
- [x] **Gestión de Sesión**: Persistencia en LocalStorage y uso de JWT en peticiones.
- [x] **Geolocalización**: Seguimiento GPS cada 120s y cálculo de distancia Haversine.
- [x] **Mapa Interactivo**: Marcadores personalizados por facultad, geocercas de 25m y lógica de proximidad.
- [x] **Interfaz Base**: Diseño responsivo unificado en MUI, ortografía corregida (sentence case).

### ⏳ Pendiente (Próximos Pasos en Orden)
1.  **Módulo de Cámara AR (ARCameraScreen.tsx)**:
    *   Activar acceso a la cámara real.
    *   Configurar UI transparente sobre el video.
2.  **Visualización 3D**:
    *   Descargar la carpeta de Drive con los modelos .glb y colocarla en el directorio `public/` del proyecto.
    *   Implementar la carga dinámica de modelos usando rutas relativas (ej: `${import.meta.env.BASE_URL}models/${nombre_modelo}`) para asegurar compatibilidad con el despliegue en GitHub Pages.
    *   Vincular con la propiedad `ruta_modelo` devuelta por la API.
3.  **Lógica de Registro de Capturas**:
    *   Conectar acción de captura con `/api/capturar`.
    *   Actualizar puntaje global tras éxito.
4.  **Sincronización de Perfil**:
    *   Traer datos reales de "Inventario" y "Ranking" desde la API.

---

## Estándares de Ingeniería
*   **Diseño**: Estética moderna/juego usando Material UI.
*   **Idioma**: Interfaz 100% en español, gramática impecable, uso de *sentence case*.
*   **Seguridad**: Validar inputs, nunca exponer el token en el código, usar `.env`.

***

### Inicio de Sesión para la IA
Si eres la IA y acabas de recibir este archivo:
1. Confirma que has leído el progreso actual.
2. Pregunta al desarrollador si desea comenzar con el primer punto de la lista **⏳ Pendiente**.
