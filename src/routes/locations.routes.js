import { Router } from 'express';
import { 
    getLocations, 
    getLocation, 
    createLocation, 
    updateLocation, 
    deleteLocation 
} from '../controllers/locations.controller.js';

const router = Router();

// OBTENER todas las ubicaciones
router.get('/locations', getLocations);

// OBTENER una ubicación por ID
router.get('/locations/:id', getLocation);

// CREAR una nueva ubicación
router.post('/locations', createLocation);

// ACTUALIZAR una ubicación (usando PATCH para actualizaciones parciales)
router.patch('/locations/:id', updateLocation);

// ELIMINAR una ubicación
router.delete('/locations/:id', deleteLocation);

export default router;
