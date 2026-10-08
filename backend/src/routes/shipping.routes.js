const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shipping.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../config/constants');

// Public shipping calculation
router.get('/rules', shippingController.listShippingRules);
router.post('/calculate', shippingController.calculateShipping);

// Admin shipping matrix configurations
router.post(
  '/rules',
  authenticateToken,
  requirePermission(PERMISSIONS.SHIPPING_MANAGE),
  shippingController.upsertShippingRule
);

router.delete(
  '/rules/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.SHIPPING_MANAGE),
  shippingController.deleteShippingRule
);

module.exports = router;
