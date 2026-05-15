// src/routes/captura.routes.js
import { Router } from 'express';
import { capturarPersonaje, getCapturasUsuario } from '../controllers/captura.controller.js';

const router = Router();

// Ruta para que un usuario capture un personaje
router.post('/capturar', capturarPersonaje);

// Ruta para obtener los personajes capturados por un usuario
router.get('/usuario/:id_usuario', getCapturasUsuario);

export default router;
