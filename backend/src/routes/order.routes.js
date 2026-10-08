const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../config/constants');

// Public checkout & live tracking
router.post('/checkout', orderController.createOrder);
router.get('/track/:orderNumber', orderController.trackOrder);

// Admin order pipeline
router.get(
  '/',
  authenticateToken,
  requirePermission(PERMISSIONS.ORDERS_READ),
  orderController.listOrders
);

router.patch(
  '/:id/status',
  authenticateToken,
  requirePermission(PERMISSIONS.ORDERS_UPDATE),
  orderController.updateStatus
);

router.get(
  '/:id/invoice.pdf',
  authenticateToken,
  requirePermission(PERMISSIONS.ORDERS_READ),
  orderController.downloadInvoicePdf
);

module.exports = router;
