const express = require('express');
const router = express.Router();
const rfqController = require('../controllers/rfq.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../config/constants');

// Public RFQ & Contact Inquiries
router.post('/submit', rfqController.submitRfq);
router.post('/inquiry', rfqController.submitInquiry);

// Admin RFQ Workflow Hub
router.get(
  '/',
  authenticateToken,
  requirePermission(PERMISSIONS.RFQ_READ),
  rfqController.listRfqs
);

router.get(
  '/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.RFQ_READ),
  rfqController.getRfqById
);

router.put(
  '/:id/quote',
  authenticateToken,
  requirePermission(PERMISSIONS.RFQ_MANAGE),
  rfqController.updateRfqQuote
);

router.get(
  '/:id/quotation.pdf',
  authenticateToken,
  requirePermission(PERMISSIONS.RFQ_READ),
  rfqController.downloadQuotationPdf
);

// Admin General Inquiries
router.get(
  '/inquiries/all',
  authenticateToken,
  requirePermission(PERMISSIONS.RFQ_READ),
  rfqController.listInquiries
);

router.patch(
  '/inquiries/:id',
  authenticateToken,
  requirePermission(PERMISSIONS.RFQ_MANAGE),
  rfqController.updateInquiryStatus
);

module.exports = router;
