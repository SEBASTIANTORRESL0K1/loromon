// src/controllers/usuario.controller.js
import { pool } from '../database/db.js';
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

// Registrar un nuevo usuario
export const registerUser = async (req, res) => {
    const { nombre_usuario, correo, contrasena } = req.body;

    if (!nombre_usuario || !correo || !contrasena) {
        return res.status(400).json({ message: "Por favor, proporciona nombre de usuario, correo y contraseña." });
    }

    try {
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, SALT_ROUNDS);

        // Insertar en la base de datos
        const [result] = await pool.query(
            "INSERT INTO Usuario (nombre_usuario, correo, contrasena) VALUES (?, ?, ?)",
            [nombre_usuario, correo, hashedPassword]
        );

        res.status(201).json({
            id_usuario: result.insertId,
            nombre_usuario,
            correo
        });

    } catch (error) {
        // Manejar error de duplicado (código de error 1062 para MySQL)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "El nombre de usuario o correo ya existe." });
        }
        console.error(error);
        return res.status(500).json({ message: 'Algo salió mal al registrar el usuario.' });
    }
};

// Obtener el ranking de jugadores
export const getRanking = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT nombre_usuario, puntos FROM Usuario ORDER BY puntos DESC LIMIT 100"
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Algo salió mal al obtener el ranking.'
        });
    }
};
