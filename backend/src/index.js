import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';
import { pool } from './database/db.js';
import { syncDatabase } from './database/sync.js';

import usuarioRoutes from './routes/usuario.routes.js';
import lugaresRoutes from './routes/lugares.routes.js';
import capturaRoutes from './routes/captura.routes.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // para entender los JSON que lleguen en el body

// Servir modelos 3D como archivos estáticos
app.use('/models', express.static(path.join(__dirname, 'modelos')));

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
    
    // Log para depuración en Railway (solo host)
    const dbHost = process.env.MYSQL_URL ? 'usando MYSQL_URL' : (process.env.MYSQLHOST || process.env.DB_HOST || 'localhost');
    console.log(`Intentando conectar a la base de datos en: ${dbHost}`);
    
    const maxRetries = 10;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const [result] = await pool.query('SELECT 1 + 1 AS result');
            if (result) {
                console.log('Conexión con la base de datos establecida correctamente');
                await syncDatabase();
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
