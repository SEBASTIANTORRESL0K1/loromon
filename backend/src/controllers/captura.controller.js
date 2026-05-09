// src/controllers/captura.controller.js
import { pool } from '../database/db.js';

const PUNTOS_ADICIONALES_MAX = 50; // Rango de aleatoriedad: de 0 a 50 puntos extra

export const capturarPersonaje = async (req, res) => {
    // En una app real, id_usuario vendría de un token JWT. Aquí lo tomamos del body por simplicidad.
    const { id_usuario, id_personaje } = req.body;

    if (!id_usuario || !id_personaje) {
        return res.status(400).json({ message: "Se requiere id_usuario y id_personaje." });
    }

    let connection;
    try {
        // 1. Iniciar una transacción
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 2. Verificar si el usuario ya capturó este personaje
        const [capturas] = await connection.query(
            "SELECT id_captura FROM Captura WHERE id_usuario = ? AND id_personaje = ?",
            [id_usuario, id_personaje]
        );

        if (capturas.length > 0) {
            await connection.rollback();
            connection.release();
            return res.status(409).json({ message: "Este personaje ya ha sido capturado por el usuario." });
        }

        // 3. Obtener el valor base de puntos del personaje
        const [personajes] = await connection.query(
            "SELECT valor_puntos FROM Personaje WHERE id_personaje = ?",
            [id_personaje]
        );

        if (personajes.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(404).json({ message: "El personaje no existe." });
        }
        const valorBasePuntos = personajes[0].valor_puntos;

        // 4. Calcular puntos aleatorios
        const puntosObtenidos = valorBasePuntos + Math.floor(Math.random() * (PUNTOS_ADICIONALES_MAX + 1));

        // 5. Insertar el nuevo registro de captura
        await connection.query(
            "INSERT INTO Captura (id_usuario, id_personaje, puntos_obtenidos) VALUES (?, ?, ?)",
            [id_usuario, id_personaje, puntosObtenidos]
        );

        // 6. Actualizar el puntaje total del usuario
        await connection.query(
            "UPDATE Usuario SET puntos = puntos + ? WHERE id_usuario = ?",
            [puntosObtenidos, id_usuario]
        );

        // 7. Si todo fue bien, confirmar la transacción
        await connection.commit();

        // 8. Enviar respuesta exitosa
        res.status(201).json({
            message: "¡Personaje capturado con éxito!",
            puntosObtenidos: puntosObtenidos
        });

    } catch (error) {
        // Si algo falla, revertir todos los cambios
        if (connection) {
            await connection.rollback();
        }
        console.error(error);
        return res.status(500).json({ message: "Algo salió mal durante la captura." });
    } finally {
        // 9. Liberar la conexión en cualquier caso
        if (connection) {
            connection.release();
        }
    }
};
