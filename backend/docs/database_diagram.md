# Diagrama Entidad-Relación

A continuación se presenta el diagrama de la base de datos utilizando la sintaxis de Mermaid.

```mermaid
erDiagram
    USUARIO ||--o{ CAPTURA : realiza
    PERSONAJE ||--o{ CAPTURA : es_capturado
    PERSONAJE ||--o{ LUGARES : aparece_en

    USUARIO {
        int id_usuario PK
        string nombre_usuario
        string correo
        string contrasena
        int puntos
    }

    PERSONAJE {
        int id_personaje PK
        string nombre_personaje
        string ruta_modelo
        int valor_puntos
        boolean es_especial
    }

    LUGARES {
        int id_lugar PK
        string nombre
        decimal latitud
        decimal longitud
        int id_personaje_1 FK
        int id_personaje_2 FK
    }

    CAPTURA {
        int id_captura PK
        int id_usuario FK
        int id_personaje FK
        int puntos_obtenidos
        timestamp fecha_captura
    }
```

## Descripción del Diagrama
- **USUARIO - CAPTURA**: Relación de uno a muchos. Un usuario puede tener múltiples registros de captura.
- **PERSONAJE - CAPTURA**: Relación de uno a muchos. Un personaje puede ser capturado por muchos usuarios distintos.
- **PERSONAJE - LUGARES**: Relación de uno a muchos. Un personaje puede estar asignado a varios lugares (aunque en el diseño actual cada lugar tiene dos FKs hacia Personaje).
