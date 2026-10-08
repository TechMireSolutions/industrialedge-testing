const { ROLES } = require('../config/constants');

/**
 * Middleware factory to enforce specific granular permissions
 *
 * @param {string|string[]} requiredPermissions - One or more permissions required
 */
function requirePermission(requiredPermissions) {
  const permList = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    // Super Admin has all privileges
    if (req.user.role_name === ROLES.SUPER_ADMIN) {
      return next();
    }

    const userPerms = req.user.permissions || [];
    const hasAny = permList.some((perm) => userPerms.includes(perm));

    if (!hasAny) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Insufficient permissions. Required: [${permList.join(', ')}]`,
        userRole: req.user.role_name
      });
    }

    next();
  };
}

/**
 * Middleware factory to restrict endpoint to specific role(s)
 * @param {string|string[]} roles
 */
function requireRole(roles) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    if (req.user.role_name === ROLES.SUPER_ADMIN || allowedRoles.includes(req.user.role_name)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: `Role not authorized. Required: [${allowedRoles.join(', ')}]`
    });
  };
}

module.exports = {
  requirePermission,
  requireRole
};
