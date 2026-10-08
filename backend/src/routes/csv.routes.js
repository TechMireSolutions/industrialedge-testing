const express = require('express');
const router = express.Router();
const csvController = require('../controllers/csv.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { uploadCsv } = require('../middleware/upload.middleware');
const { PERMISSIONS } = require('../config/constants');

router.use(authenticateToken);

router.post(
  '/import',
  requirePermission(PERMISSIONS.PRODUCTS_BULK),
  uploadCsv.single('file'),
  csvController.importProductsCsv
);

router.get(
  '/export',
  requirePermission(PERMISSIONS.PRODUCTS_READ),
  csvController.exportProductsCsv
);

module.exports = router;
