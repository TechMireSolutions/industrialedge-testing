const logger = require('../utils/logger');
const env = require('../config/env');

/**
 * Handle 404 Not Found routes
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: 'NotFound',
    message: `Resource endpoint '${req.method} ${req.originalUrl}' does not exist on this server.`
  });
}

/**
 * Centralized global error handling middleware
 */
function errorHandler(err, req, res, next) {
  logger.error('Unhandled Application Error', {
    error: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method
  });

  // Handle Multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      error: 'FileUploadError',
      message: err.message
    });
  }

  // Handle PostgreSQL specific errors
  if (err.code) {
    switch (err.code) {
      case '23505': // unique_violation
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: 'A duplicate record already exists with this unique identifier (e.g., SKU, Slug, or Email).',
          detail: err.detail
        });
      case '23503': // foreign_key_violation
        return res.status(400).json({
          success: false,
          error: 'ForeignKeyViolation',
          message: 'Referenced entity (such as Category or Customer) does not exist.',
          detail: err.detail
        });
      case '22P02': // invalid_text_representation
        return res.status(400).json({
          success: false,
          error: 'InvalidFormat',
          message: 'Input parameter format is invalid (e.g., expected UUID or integer).'
        });
    }
  }

  // Default server error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected internal server error occurred.',
    ...(env.NODE_ENV !== 'production' && { stack: err.stack })
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
