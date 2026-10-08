const express = require('express');
const router = express.Router();
const cmsController = require('../controllers/cms.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../config/constants');

// Public CMS Content
router.get('/banners', cmsController.listBanners);
router.get('/corporate', cmsController.getCorporateSections);
router.get('/faqs', cmsController.listFaqs);
router.get('/policies', cmsController.listPolicyPages);
router.get('/policies/:slug', cmsController.getPolicyPage);

// Admin CMS Control (Guarded)
router.post(
  '/banners',
  authenticateToken,
  requirePermission(PERMISSIONS.CMS_MANAGE),
  cmsController.createBanner
);

router.put(
  '/banners/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.CMS_MANAGE),
  cmsController.updateBanner
);

router.delete(
  '/banners/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.CMS_MANAGE),
  cmsController.deleteBanner
);

router.put(
  '/corporate/:sectionKey',
  authenticateToken,
  requirePermission(PERMISSIONS.CMS_MANAGE),
  cmsController.upsertCorporateSection
);

router.post(
  '/faqs',
  authenticateToken,
  requirePermission(PERMISSIONS.CMS_MANAGE),
  cmsController.createFaq
);

router.put(
  '/faqs/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.CMS_MANAGE),
  cmsController.updateFaq
);

router.delete(
  '/faqs/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.CMS_MANAGE),
  cmsController.deleteFaq
);

router.post(
  '/policies',
  authenticateToken,
  requirePermission(PERMISSIONS.CMS_MANAGE),
  cmsController.upsertPolicyPage
);

router.delete(
  '/policies/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.CMS_MANAGE),
  cmsController.deletePolicyPage
);

module.exports = router;
