const fs = require('fs/promises');
const path = require('path');
const { pool } = require('../config/db');
const logger = require('../utils/logger');

async function runMigrations() {
  logger.info('Starting PostgreSQL schema migration...');
  const schemaPath = path.join(__dirname, 'schema.sql');

  try {
    const schemaSql = await fs.readFile(schemaPath, 'utf-8');
    const client = await pool.connect();

    try {
      await client.query(schemaSql);
      logger.info('Database schema migration applied successfully! All tables, triggers, and indexes are active.');
    } finally {
      client.release();
    }
  } catch (error) {
    logger.error('Database migration failed', { error: error.message, stack: error.stack });
    process.exit(1);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;
