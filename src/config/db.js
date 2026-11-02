import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'rajmuni_civil_pdf',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20, // Max concurrent connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]: Unexpected error on idle client', err);
});

/**
 * Execute a query with parameterized values
 * @param {string} text - SQL query text
 * @param {Array} [params] - Optional query parameters
 */
export const query = (text, params) => pool.query(text, params);

/**
 * Test the database connection and return server details
 */
export async function testConnection() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT current_database() as db_name, current_user as db_user, version() as version;');
    return {
      connected: true,
      database: res.rows[0].db_name,
      user: res.rows[0].db_user,
      version: res.rows[0].version,
    };
  } finally {
    client.release();
  }
}

export default pool;
