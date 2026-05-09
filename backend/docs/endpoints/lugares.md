# Documentación de Endpoints: Lugares

Endpoints para obtener información geográfica y personajes asignados.

## Obtener Lugares

Lista todos los lugares registrados con sus coordenadas y los personajes que aparecen en ellos.

- **URL**: `/api/lugares`
- **Método**: `GET`
- **Cuerpo (Body)**: No requerido.

- **Ejemplo cURL**:
  ```bash
  curl -X GET http://localhost:3001/api/lugares
  ```

- **Ejemplo de Respuesta Exitosa (200 OK)**:
  ```json
  [
    {
      "id_lugar": 1,
      "nombre": "Facultad de Telemática",
      "latitud": "19.24912000",
      "longitud": "-103.69735900",
      "personaje1": {
        "id_personaje": 1,
        "nombre_personaje": "Ingeniero en Software",
        "ruta_modelo": "models/ingeniero.glb",
        "valor_puntos": 100,
        "es_especial": 0
      },
      "personaje2": {
        "id_personaje": 2,
        "nombre_personaje": "Telemático",
        "ruta_modelo": "models/telematico.glb",
        "valor_puntos": 100,
        "es_especial": 0
      }
    }
  ]
  ```

- **Posibles Errores**:
  - `500 Internal Server Error`: Error al obtener los lugares.
