import { createPool } from 'mysql2/promise';
import {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_DATABASE,
    DB_PORT
} from '../config.js';

// Priorizar URL de conexión completa (Railway)
const connectionUri = process.env.MYSQL_URL || process.env.DATABASE_URL;

let poolConfig;

if (connectionUri) {
    // Si hay una URI, le concatenamos el parámetro para permitir múltiples sentencias
    const separator = connectionUri.includes('?') ? '&' : '?';
    poolConfig = `${connectionUri}${separator}multipleStatements=true`;
} else {
    poolConfig = {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        port: DB_PORT,
        multipleStatements: true
    };
}

export const pool = createPool(poolConfig);
