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
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS likes (
          user_id INTEGER NOT NULL,
          post_id INTEGER NOT NULL,
          PRIMARY KEY (user_id, post_id)
        );
      `);
      logger.info('📦 Tabla posts verificada o creada');
    } catch (err) {
      logger.error('❌ Error al conectar con PostgreSQL', err);
    }
}

export function getPool(): Pool {
    if (!pool) throw new Error('❌ El pool de PostgreSQL no está inicializado');
    return pool;
}