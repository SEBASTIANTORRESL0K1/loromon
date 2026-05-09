// src/routes/usuario.routes.js
import { Router } from 'express';
import { registerUser, loginUser, getRanking } from '../controllers/usuario.controller.js';

const router = Router();

// Ruta para registrar un nuevo usuario
router.post('/usuarios/register', registerUser);

// Ruta para iniciar sesión
router.post('/usuarios/login', loginUser);

// Ruta para obtener el ranking de jugadores
router.get('/ranking', getRanking);

export default router;
