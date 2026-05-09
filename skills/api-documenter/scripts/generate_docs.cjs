import fs from 'fs';
import path from 'path';

/**
 * Script para automatizar la generación de documentación de la API.
 * Busca rutas y controladores en 'src/' y genera archivos .md en 'docs/'.
 */

const srcDir = path.resolve('src');
const docsDir = path.resolve('docs');

if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
}

function generateDoc() {
    console.log('--- Iniciando generación de documentación ---');
    // Esta es una versión simplificada que delega el análisis al agente, 
    // pero asegura que la estructura de carpetas exista.
    // El agente usará sus herramientas de búsqueda para llenar el contenido.
    console.log(`Buscando en: ${srcDir}`);
    console.log(`Destino: ${docsDir}`);
    
    // El script podría extenderse para usar regex y extraer info básica,
    // pero para este entorno, el agente es mejor analizando el código semánticamente.
}

generateDoc();
