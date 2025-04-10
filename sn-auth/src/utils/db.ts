import { Pool } from "pg";
import logger from "../logger";

let pool: Pool;

export async function createConnection() {
    try {
      pool = new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'social_network',
        password: process.env.DB_PASSWORD || 'postgres',
        port: parseInt(process.env.DB_PORT || '5432', 10),
      });

      logger.info('✅ Conexión con PostgreSQL establecida');
  
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password TEXT NOT NULL
        )
      `);
      logger.info('📦 Tabla users verificada o creada');
    } catch (err) {
      logger.error('❌ Error al conectar con PostgreSQL', err);
    }
}

export function getPool(): Pool {
    if (!pool) throw new Error('❌ El pool de PostgreSQL no está inicializado');
    return pool;
}