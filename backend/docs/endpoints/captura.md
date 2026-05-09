# Documentación de Endpoints: Capturas

Endpoints para registrar la interacción de captura de personajes.

## Capturar Personaje

Registra que un usuario ha capturado un personaje y suma puntos a su cuenta.

- **URL**: `/api/capturar`
- **Método**: `POST`
- **Cuerpo (Body)**:
  ```json
  {
    "id_usuario": "number",
    "id_personaje": "number"
  }
  ```

- **Ejemplo cURL**:
  ```bash
  curl -X POST http://localhost:3001/api/capturar \
    -H "Content-Type: application/json" \
    -d '{"id_usuario": 1, "id_personaje": 5}'
  ```

- **Ejemplo de Respuesta Exitosa (201 Created)**:
  ```json
  {
    "message": "¡Personaje capturado con éxito!",
    "puntosObtenidos": 124
  }
  ```

- **Posibles Errores**:
  - `400 Bad Request`: Se requiere `id_usuario` e `id_personaje`.
  - `404 Not Found`: El personaje especificado no existe.
  - `409 Conflict`: El usuario ya había capturado a este personaje anteriormente.
  - `500 Internal Server Error`: Error durante el proceso de captura o transacción.
