// src/routes/lugares.routes.js
import { Router } from 'express';
import { getLugares } from '../controllers/lugares.controller.js';

const router = Router();

// Ruta para obtener todos los lugares y sus personajes
router.get('/lugares', getLugares);

export default router;
