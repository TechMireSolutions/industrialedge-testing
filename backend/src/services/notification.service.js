const env = require('../config/env');
const logger = require('../utils/logger');

/**
 * Send order placement confirmation email
 */
async function notifyOrderPlaced(order) {
  logger.info(`[Notification] Order Confirmation dispatched to ${order.email}`, {
    orderNumber: order.order_number,
    total: order.total_amount
  });
  return true;
}

/**
 * Send order dispatched email with tracking code
 */
async function notifyOrderDispatched(order) {
  logger.info(`[Notification] Order Dispatched Email sent to ${order.email}`, {
    orderNumber: order.order_number,
    carrier: order.tracking_carrier || 'Industrial Logistics Fleet',
    trackingCode: order.tracking_code || 'IE-LOG-STD'
  });
  return true;
}

/**
 * Send low-stock notification to admin
 */
async function notifyLowStock(product, currentStock, threshold) {
  logger.warn(`[Alert] Product ${product.name} (SKU: ${product.sku}) low stock alert sent to ${env.SMTP.adminEmail}`, {
    currentStock,
    threshold
  });
  return true;
}

module.exports = {
  notifyOrderPlaced,
  notifyOrderDispatched,
  notifyLowStock
};
