import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function syncDatabase() {
    try {
        console.log('Iniciando sincronización de la base de datos...');
        const sqlPath = path.join(__dirname, 'database.sql');
        const sql = await fs.readFile(sqlPath, 'utf8');
        
        // Ejecutar todo el script SQL
        // Gracias a multipleStatements: true, podemos enviar el archivo completo
        await pool.query(sql);
        
        console.log('Base de datos sincronizada correctamente (Tablas recreadas y datos insertados).');
    } catch (error) {
        console.error('Error durante la sincronización de la base de datos:', error.message);
        // No lanzamos el error para no detener el inicio de la app si la BD ya está bien
        // pero podrías querer lanzarlo si es crítico.
    }
}
