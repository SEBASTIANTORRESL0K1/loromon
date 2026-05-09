# Documentación de Endpoints: Usuarios

Endpoints relacionados con la gestión de usuarios y rankings.

## Registrar Usuario

Crea una nueva cuenta de usuario en el sistema.

- **URL**: `/api/usuarios/register`
- **Método**: `POST`
- **Cuerpo (Body)**:
  ```json
  {
    "nombre_usuario": "string",
    "correo": "string",
    "contrasena": "string"
  }
  ```

- **Ejemplo cURL**:
  ```bash
  curl -X POST http://localhost:3001/api/usuarios/register \
    -H "Content-Type: application/json" \
    -d '{"nombre_usuario": "AshKetchum", "correo": "ash@pueblopaleta.com", "contrasena": "pika123"}'
  ```

- **Ejemplo de Respuesta Exitosa (201 Created)**:
  ```json
  {
    "id_usuario": 1,
    "nombre_usuario": "AshKetchum",
    "correo": "ash@pueblopaleta.com"
  }
  ```

- **Posibles Errores**:
  - `400 Bad Request`: Faltan campos obligatorios.
  - `409 Conflict`: El nombre de usuario o correo ya está registrado.
  - `500 Internal Server Error`: Error en el servidor o base de datos.

---

## Iniciar Sesión

Autentica a un usuario y devuelve su información de perfil.

- **URL**: `/api/usuarios/login`
- **Método**: `POST`
- **Cuerpo (Body)**:
  ```json
  {
    "correo": "string",
    "contrasena": "string"
  }
  ```

- **Ejemplo cURL**:
  ```bash
  curl -X POST http://localhost:3001/api/usuarios/login \
    -H "Content-Type: application/json" \
    -d '{"correo": "ash@pueblopaleta.com", "contrasena": "pika123"}'
  ```

- **Ejemplo de Respuesta Exitosa (200 OK)**:
  ```json
  {
    "id_usuario": 1,
    "nombre_usuario": "AshKetchum",
    "correo": "ash@pueblopaleta.com",
    "puntos": 1250,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- **Posibles Errores**:
  - `400 Bad Request`: Faltan campos obligatorios.
  - `401 Unauthorized`: Correo o contraseña incorrectos.
  - `500 Internal Server Error`: Error en el servidor o base de datos.

---

## Obtener Ranking

Retorna los 100 mejores usuarios ordenados por puntaje.

- **URL**: `/api/ranking`
- **Método**: `GET`
- **Cuerpo (Body)**: No requerido.

- **Ejemplo cURL**:
  ```bash
  curl -X GET http://localhost:3001/api/ranking
  ```

- **Ejemplo de Respuesta Exitosa (200 OK)**:
  ```json
  [
    {
      "nombre_usuario": "AshKetchum",
      "puntos": 1250
    },
    {
      "nombre_usuario": "Misty",
      "puntos": 980
    }
  ]
  ```

- **Posibles Errores**:
  - `500 Internal Server Error`: Error al consultar el ranking.
