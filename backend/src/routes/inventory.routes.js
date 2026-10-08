const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../config/constants');

router.use(authenticateToken);

router.get(
  '/low-stock',
  requirePermission(PERMISSIONS.INVENTORY_READ),
  inventoryController.getLowStockAlerts
);

router.post(
  '/adjust',
  requirePermission(PERMISSIONS.INVENTORY_ADJUST),
  inventoryController.adjustStock
);

router.get(
  '/logs',
  requirePermission(PERMISSIONS.INVENTORY_READ),
  inventoryController.getLogs
);

module.exports = router;
