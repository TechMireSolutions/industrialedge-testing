const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const { authenticateToken } = require('../middleware/auth.middleware');
const { requirePermission } = require('../middleware/rbac.middleware');
const { PERMISSIONS } = require('../config/constants');

router.use(authenticateToken);

router.get(
  '/',
  requirePermission(PERMISSIONS.CUSTOMERS_READ),
  customerController.listCustomers
);

router.get(
  '/:id',
  requirePermission(PERMISSIONS.CUSTOMERS_READ),
  customerController.getCustomerDetails
);

module.exports = router;
