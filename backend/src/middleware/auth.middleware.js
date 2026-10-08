const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { query } = require('../config/db');

/**
 * Middleware to authenticate JWT access tokens for protected admin endpoints
 */
async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'AuthenticationRequired',
      message: 'Access denied: No Bearer token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // Fetch user from DB to verify still active and obtain assigned role & permissions
    const userResult = await query(
      `SELECT u.id, u.email, u.name, u.is_active, r.id as role_id, r.name as role_name
       FROM admin_users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1`,
      [decoded.id]
    );

    if (userResult.rowCount === 0) {
      return res.status(401).json({
        success: false,
        error: 'InvalidUser',
        message: 'The user account associated with this token no longer exists'
      });
    }

    const user = userResult.rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        error: 'AccountDisabled',
        message: 'Your administrator account has been deactivated'
      });
    }

    // Fetch user permissions
    const permResult = await query(
      `SELECT p.name
       FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = $1`,
      [user.role_id]
    );

    user.permissions = permResult.rows.map((row) => row.name);

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'TokenExpired',
        message: 'Your authentication session has expired. Please log in again.'
      });
    }
    return res.status(403).json({
      success: false,
      error: 'InvalidToken',
      message: 'Authentication token is invalid or malformed'
    });
  }
}

/**
 * Optional authentication: attaches user if token present, but does not block if not
 */
async function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const userResult = await query(
      `SELECT u.id, u.email, u.name, r.name as role_name
       FROM admin_users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = $1 AND u.is_active = TRUE`,
      [decoded.id]
    );
    if (userResult.rowCount > 0) {
      req.user = userResult.rows[0];
    }
  } catch {
    // Ignore invalid token in optional auth
  }
  next();
}

module.exports = {
  authenticateToken,
  optionalAuth
};
