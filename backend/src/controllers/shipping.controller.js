const shippingService = require('../services/shipping.service');

async function listShippingRules(req, res, next) {
  try {
    const rules = await shippingService.listShippingRules();
    res.json({ success: true, rules });
  } catch (error) {
    next(error);
  }
}

async function upsertShippingRule(req, res, next) {
  try {
    const rule = await shippingService.upsertShippingRule(req.body);
    res.json({ success: true, rule });
  } catch (error) {
    next(error);
  }
}

async function deleteShippingRule(req, res, next) {
  try {
    await shippingService.deleteShippingRule(req.params.id);
    res.json({ success: true, message: 'Shipping rule deleted successfully' });
  } catch (error) {
    next(error);
  }
}

async function calculateShipping(req, res, next) {
  try {
    const { items = [], regionId, city, orderSubtotal = 0 } = req.body;
    const result = await shippingService.calculateShippingFee(items, regionId, city, parseFloat(orderSubtotal));
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listShippingRules,
  upsertShippingRule,
  deleteShippingRule,
  calculateShipping
};
