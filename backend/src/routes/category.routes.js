const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../config/constants');

// Categories
router.get('/', categoryController.listCategories);
router.get('/:id', categoryController.getCategoryById);

router.post(
  '/',
  authenticateToken,
  requirePermission(PERMISSIONS.PRODUCTS_CREATE),
  categoryController.createCategory
);

router.put(
  '/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.PRODUCTS_UPDATE),
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.PRODUCTS_DELETE),
  categoryController.deleteCategory
);

// Subcategories
router.post(
  '/subcategories',
  authenticateToken,
  requirePermission(PERMISSIONS.PRODUCTS_CREATE),
  categoryController.createSubcategory
);

router.delete(
  '/subcategories/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.PRODUCTS_DELETE),
  categoryController.deleteSubcategory
);

// Tags
router.get('/tags/all', categoryController.listTags);

router.post(
  '/tags',
  authenticateToken,
  requirePermission(PERMISSIONS.PRODUCTS_CREATE),
  categoryController.createTag
);

router.delete(
  '/tags/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.PRODUCTS_DELETE),
  categoryController.deleteTag
);

module.exports = router;
