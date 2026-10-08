const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricing.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../config/constants');

// Public pricing tools
router.get('/currencies', pricingController.listCurrencies);
router.get('/convert', pricingController.convertPrice);
router.get('/calculate', pricingController.calculatePrice);

// Admin multi-currency & B2B tier configuration
router.post(
  '/currencies',
  authenticateToken,
  requirePermission(PERMISSIONS.PRICING_MANAGE),
  pricingController.upsertCurrency
);

router.get(
  '/b2b-tiers',
  authenticateToken,
  requirePermission(PERMISSIONS.PRICING_MANAGE),
  pricingController.listB2BTiers
);

router.post(
  '/b2b-tiers',
  authenticateToken,
  requirePermission(PERMISSIONS.PRICING_MANAGE),
  pricingController.createB2BTier
);

router.delete(
  '/b2b-tiers/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.PRICING_MANAGE),
  pricingController.deleteB2BTier
);

module.exports = router;
