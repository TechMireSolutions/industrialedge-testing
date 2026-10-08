const { Pool } = require('pg');
const env = require('./env');
const logger = require('../utils/logger');

let pool = null;

try {
  pool = new Pool({
    host: env.DB.host,
    port: env.DB.port,
    database: env.DB.database,
    user: env.DB.user,
    password: env.DB.password,
    ssl: env.DB.ssl,
    min: env.DB.min,
    max: env.DB.max,
    idleTimeoutMillis: env.DB.idleTimeoutMillis,
    connectionTimeoutMillis: env.DB.connectionTimeoutMillis
  });

  pool.on('connect', () => {
    logger.debug('New PostgreSQL client connected to connection pool');
  });

  pool.on('error', (err) => {
    logger.error('Unexpected PostgreSQL idle client error', { error: err.message, stack: err.stack });
  });
} catch (err) {
  logger.error('Failed to initialize PostgreSQL pool', { error: err.message });
}

/**
 * Execute parameterized query on PostgreSQL pool
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<import('pg').QueryResult>}
 */
async function query(text, params = []) {
  if (!pool) {
    throw new Error('Database pool is not initialized');
  }
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('Executed DB Query', { query: text.trim().substring(0, 80), duration: `${duration}ms`, rows: res.rowCount });
    return res;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error('DB Query Error', { query: text, error: error.message, duration: `${duration}ms` });
    throw error;
  }
}

/**
 * Executes a callback within a managed ACID transaction
 * Automatically performs BEGIN, COMMIT on success, or ROLLBACK on error
 * @param {Function} callback - Async function receiving the dedicated pg client
 */
async function withTransaction(callback) {
  if (!pool) {
    throw new Error('Database pool is not initialized');
  }
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Transaction rolled back due to error', { error: error.message });
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Check database connection health
 */
async function healthCheck() {
  try {
    const res = await query('SELECT NOW() as current_time, current_database() as database');
    return {
      status: 'healthy',
      database: res.rows[0].database,
      currentTime: res.rows[0].current_time
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    };
  }
}

module.exports = {
  pool,
  query,
  withTransaction,
  healthCheck
};
