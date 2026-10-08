const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { uploadImages } = require('../middleware/upload.middleware');
const { PERMISSIONS } = require('../config/constants');

router.use(authenticateToken);

router.post(
  '/upload',
  requirePermission(PERMISSIONS.PRODUCTS_UPDATE),
  uploadImages.array('images', 10),
  mediaController.uploadMedia
);

router.delete(
  '/image/:imageId',
  requirePermission(PERMISSIONS.PRODUCTS_UPDATE),
  mediaController.deleteProductImage
);

module.exports = router;
