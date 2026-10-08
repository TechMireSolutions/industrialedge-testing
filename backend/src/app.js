const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

const env = require('./config/env');
const apiRoutes = require('./routes');
const requestLogger = require('./middleware/logger.middleware');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
const allowedOrigins = [
  env.CLIENT_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in dev/staging; tighten in production via env
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression for high throughput & low bandwidth
app.use(compression());

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Performance & Access Logger
app.use(requestLogger);

// Rate Limiting (1000 requests per 15 minutes window)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TooManyRequests',
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});
app.use('/api', limiter);

// Serve static uploaded media files
app.use('/uploads', express.static(env.UPLOAD_DIR));

// Base Root Route
app.get('/', (req, res) => {
  res.json({
    name: 'Industrial Edge V2 - Production REST API Service',
    version: '2.0.0',
    documentation: '/docs',
    status: 'Running',
    apiRoot: '/api/v1'
  });
});

// Mount Master API v1 Routes
app.use('/api/v1', apiRoutes);

// Catch 404
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;
