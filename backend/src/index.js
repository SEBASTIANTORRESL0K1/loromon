import express from 'express';
import { PORT } from './config.js';
import { pool } from './database/db.js';

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

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const [result] = await pool.query('SELECT 1 + 1 AS result');
            if (result) {
                console.log('Conexión con la base de datos establecida correctamente');
                break;
            }
        } catch (error) {
            retries++;
            console.log(`Intento ${retries}/${maxRetries}: Esperando a la base de datos...`);
            if (retries >= maxRetries) {
                console.error('Error final al conectar con la base de datos:', error.message);
            } else {
                // Esperar 3 segundos antes del siguiente reintento
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    }
});
