import express from 'express';
import { PORT } from './config.js';

import usuarioRoutes from './routes/usuario.routes.js';
import lugaresRoutes from './routes/lugares.routes.js';
import capturaRoutes from './routes/captura.routes.js';

const app = express();

// Middlewares
app.use(express.json()); // para entender los JSON que lleguen en el body

// Routes
app.use('/api', usuarioRoutes);
app.use('/api', lugaresRoutes);
app.use('/api', capturaRoutes);


// Ruta para manejar endpoints no encontrados
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Endpoint not found'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
