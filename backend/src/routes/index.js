const express = require('express');
const router = express.Router();
const { healthCheck } = require('../config/db');

const authRoutes = require('./auth.routes');
const rbacRoutes = require('./rbac.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const inventoryRoutes = require('./inventory.routes');
const csvRoutes = require('./csv.routes');
const mediaRoutes = require('./media.routes');
const pricingRoutes = require('./pricing.routes');
const shippingRoutes = require('./shipping.routes');
const cmsRoutes = require('./cms.routes');
const orderRoutes = require('./order.routes');
const rfqRoutes = require('./rfq.routes');
const customerRoutes = require('./customer.routes');
const settingsRoutes = require('./settings.routes');

// System Health Check
router.get('/health', async (req, res) => {
  const dbHealth = await healthCheck();
  res.json({
    service: 'Industrial Edge V2 Backend REST API',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: dbHealth
  });
});

// Mount modular sub-routers
router.use('/auth', authRoutes);
router.use('/rbac', rbacRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/csv', csvRoutes);
router.use('/media', mediaRoutes);
router.use('/pricing', pricingRoutes);
router.use('/shipping', shippingRoutes);
router.use('/cms', cmsRoutes);
router.use('/orders', orderRoutes);
router.use('/rfq', rfqRoutes);
router.use('/customers', customerRoutes);
router.use('/settings', settingsRoutes);

module.exports = router;
