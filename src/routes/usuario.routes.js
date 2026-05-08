// src/routes/usuario.routes.js
import { Router } from 'express';
import { registerUser, getRanking } from '../controllers/usuario.controller.js';

const router = Router();

// Ruta para registrar un nuevo usuario
router.post('/usuarios/register', registerUser);

// Ruta para obtener el ranking de jugadores
router.get('/ranking', getRanking);

export default router;
