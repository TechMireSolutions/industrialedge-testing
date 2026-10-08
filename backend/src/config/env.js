const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

  // Database
  DB_TYPE: process.env.DB_TYPE || 'sqlite3',
  SQLITE_DB_PATH: process.env.SQLITE_DB_PATH || path.resolve(__dirname, '../../../data/industrial_edge.sqlite'),
  DB: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'industrial_edge_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    min: parseInt(process.env.DB_POOL_MIN || '2', 10),
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MILLIS || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MILLIS || '5000', 10)
  },

  // JWT Security
  JWT_SECRET: process.env.JWT_SECRET || 'industrial-edge-super-secure-jwt-secret-key-32-chars-long!',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '10', 10),

  // CDN & Uploads
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.resolve(__dirname, '../../uploads'),
  CDN_BASE_URL: process.env.CDN_BASE_URL || 'https://cdn.industrialedge.pk',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),

  // Notification Email
  SMTP: {
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromEmail: process.env.FROM_EMAIL || 'support@industrialedge.pk',
    adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@industrialedge.pk'
  }
};

module.exports = env;
