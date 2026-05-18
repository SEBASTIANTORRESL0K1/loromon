import { config } from 'dotenv';

config();

export const PORT = process.env.PORT || 3000;

// Priorizar variables de Railway (MYSQLHOST) si existen, de lo contrario usar las nuestras o defaults
export const DB_HOST = process.env.MYSQLHOST || process.env.DB_HOST || 'localhost';
export const DB_USER = process.env.MYSQLUSER || process.env.DB_USER || 'root';
export const DB_PASSWORD = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '';
export const DB_DATABASE = process.env.MYSQLDATABASE || process.env.DB_DATABASE || 'locations_db';
export const DB_PORT = process.env.MYSQLPORT || process.env.DB_PORT || 3306;

export const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_por_defecto_123';
