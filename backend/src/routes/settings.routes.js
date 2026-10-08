const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../config/constants');

// Public settings (e.g. SEO, company info, checkout requirements)
router.get('/', settingsController.getAllSettings);
router.get('/:group', settingsController.getSettingGroup);

// Admin settings modification
router.put(
  '/:group',
  authenticateToken,
  requirePermission(PERMISSIONS.SETTINGS_MANAGE),
  settingsController.updateSettingGroup
);

module.exports = router;
