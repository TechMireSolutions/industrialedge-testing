const env = require('../config/env');

const levels = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const currentLevel = env.NODE_ENV === 'production' ? levels.INFO : levels.DEBUG;

function formatLog(level, message, meta) {
  const timestamp = new Date().toISOString();
  if (env.NODE_ENV === 'production') {
    return JSON.stringify({ timestamp, level, message, ...meta });
  }
  const metaStr = meta && Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
  const colors = {
    DEBUG: '\x1b[36m', // Cyan
    INFO: '\x1b[32m',  // Green
    WARN: '\x1b[33m',  // Yellow
    ERROR: '\x1b[31m', // Red
    RESET: '\x1b[0m'
  };
  return `${colors[level] || ''}[${timestamp}] [${level}]${colors.RESET || ''} ${message}${metaStr}`;
}

const logger = {
  debug: (message, meta = {}) => {
    if (currentLevel <= levels.DEBUG) console.debug(formatLog('DEBUG', message, meta));
  },
  info: (message, meta = {}) => {
    if (currentLevel <= levels.INFO) console.info(formatLog('INFO', message, meta));
  },
  warn: (message, meta = {}) => {
    if (currentLevel <= levels.WARN) console.warn(formatLog('WARN', message, meta));
  },
  error: (message, meta = {}) => {
    if (currentLevel <= levels.ERROR) console.error(formatLog('ERROR', message, meta));
  }
};

module.exports = logger;
