const inventoryService = require('../services/inventory.service');

async function getLowStockAlerts(req, res, next) {
  try {
    const alerts = await inventoryService.getLowStockAlerts();
    res.json({ success: true, count: alerts.length, alerts });
  } catch (error) {
    next(error);
  }
}

async function adjustStock(req, res, next) {
  try {
    const { productId, adjustmentAmount, changeType, referenceId, notes } = req.body;
    if (!productId || adjustmentAmount === undefined) {
      return res.status(400).json({ success: false, message: 'productId and adjustmentAmount are required' });
    }
    const adminUser = req.user ? req.user.email : 'admin';
    const result = await inventoryService.adjustStock(
      productId,
      parseInt(adjustmentAmount, 10),
      changeType || 'adjustment',
      referenceId,
      notes,
      adminUser
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

async function getLogs(req, res, next) {
  try {
    const { productId, limit } = req.query;
    const logs = await inventoryService.getInventoryLogs(productId, limit ? parseInt(limit, 10) : 50);
    res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLowStockAlerts,
  adjustStock,
  getLogs
};
