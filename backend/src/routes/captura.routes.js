// src/routes/captura.routes.js
import { Router } from 'express';
import { capturarPersonaje } from '../controllers/captura.controller.js';

const router = Router();

// Ruta para que un usuario capture un personaje
router.post('/capturar', capturarPersonaje);

export default router;
