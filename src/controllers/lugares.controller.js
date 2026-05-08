// src/controllers/lugares.controller.js
import { pool } from '../database/db.js';

export const getLugares = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                l.id_lugar,
                l.nombre,
                l.latitud,
                l.longitud,
                JSON_OBJECT(
                    'id_personaje', p1.id_personaje, 
                    'nombre_personaje', p1.nombre_personaje,
                    'ruta_modelo', p1.ruta_modelo,
                    'valor_puntos', p1.valor_puntos,
                    'es_especial', p1.es_especial
                ) as personaje1,
                JSON_OBJECT(
                    'id_personaje', p2.id_personaje, 
                    'nombre_personaje', p2.nombre_personaje,
                    'ruta_modelo', p2.ruta_modelo,
                    'valor_puntos', p2.valor_puntos,
                    'es_especial', p2.es_especial
                ) as personaje2
            FROM Lugares l
            JOIN Personaje p1 ON l.id_personaje_1 = p1.id_personaje
            JOIN Personaje p2 ON l.id_personaje_2 = p2.id_personaje
        `);

        // MySQL con JSON_OBJECT devuelve los objetos como strings, hay que parsearlos.
        const lugares = rows.map(lugar => ({
            ...lugar,
            personaje1: JSON.parse(lugar.personaje1),
            personaje2: JSON.parse(lugar.personaje2)
        }));

        res.json(lugares);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Algo salió mal al obtener los lugares.'
        });
    }
};
