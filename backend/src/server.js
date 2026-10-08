const app = require('./app');
const env = require('./config/env');
const { pool, healthCheck } = require('./config/db');
const logger = require('./utils/logger');

const server = app.listen(env.PORT, async () => {
  logger.info(`=======================================================`);
  logger.info(` Industrial Edge V2 - Production REST API Backend Server`);
  logger.info(` Environment: ${env.NODE_ENV}`);
  logger.info(` Server Listening on: http://localhost:${env.PORT}`);
  logger.info(` Master API Endpoint: http://localhost:${env.PORT}/api/v1`);
  logger.info(` Allowed Frontend Client: ${env.CLIENT_URL}`);
  logger.info(`=======================================================`);

  // Check PostgreSQL connectivity
  const dbStatus = await healthCheck();
  if (dbStatus.status === 'healthy') {
    logger.info(`PostgreSQL Database connected successfully: [${dbStatus.database}] at ${dbStatus.currentTime}`);
  } else {
    logger.warn(`PostgreSQL Database connection warning: ${dbStatus.error}. Make sure PostgreSQL is started or run 'npm run db:setup'`);
  }
});

// Graceful Shutdown
function handleShutdown(signal) {
  logger.info(`Received ${signal}. Gracefully shutting down Industrial Edge API server...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    if (pool) {
      await pool.end();
      logger.info('PostgreSQL connection pool closed.');
    }
    process.exit(0);
  });

  // Force shutdown after timeout
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', { reason, promise });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception thrown', { error: error.message, stack: error.stack });
  process.exit(1);
});
