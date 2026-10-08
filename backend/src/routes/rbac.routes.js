const express = require('express');
const router = express.Router();
const rbacController = require('../controllers/rbac.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission, requireRole } = require('../middleware/rbac.middleware');
const { PERMISSIONS, ROLES } = require('../config/constants');

// All RBAC endpoints require authentication and Super Admin or USERS_MANAGE permission
router.use(authenticateToken);

router.get('/roles', requirePermission(PERMISSIONS.USERS_MANAGE), rbacController.listRoles);
router.post('/roles', requireRole(ROLES.SUPER_ADMIN), rbacController.createRole);
router.get('/permissions', requirePermission(PERMISSIONS.USERS_MANAGE), rbacController.listPermissions);

router.get('/staff', requirePermission(PERMISSIONS.USERS_MANAGE), rbacController.listStaff);
router.post('/staff', requireRole(ROLES.SUPER_ADMIN), rbacController.createStaff);
router.patch('/staff/:id', requireRole(ROLES.SUPER_ADMIN), rbacController.updateStaff);

module.exports = router;
