const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../config/constants');

// Public catalog routes
router.get('/', productController.listProducts);
router.get('/slug/:slug', productController.getProductBySlug);

// Automated triggers
router.get('/triggers/sku', authenticateToken, productController.generateSkuTrigger);
router.get('/triggers/slug', authenticateToken, productController.generateSlugTrigger);

// Public single product lookup
router.get('/:id', productController.getProductById);

// Admin catalog management endpoints
router.post(
  '/',
  authenticateToken,
  requirePermission(PERMISSIONS.PRODUCTS_CREATE),
  productController.createProduct
);

router.put(
  '/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.PRODUCTS_UPDATE),
  productController.updateProduct
);

router.post(
  '/:id/duplicate',
  authenticateToken,
  requirePermission(PERMISSIONS.PRODUCTS_CREATE),
  productController.duplicateProduct
);

router.delete(
  '/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.PRODUCTS_DELETE),
  productController.deleteProduct
);

module.exports = router;
