const { query, withTransaction } = require('../config/db');
const logger = require('../utils/logger');

/**
 * Get products that have fallen below their configured low-stock threshold
 */
async function getLowStockAlerts() {
  const sql = `
    SELECT p.id, p.sku, p.name, p.stock_quantity, p.low_stock_threshold, p.unit,
           c.name as category_name,
           (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = TRUE AND p.stock_quantity <= p.low_stock_threshold
    ORDER BY p.stock_quantity ASC
  `;
  const res = await query(sql);
  return res.rows;
}

/**
 * Adjust stock quantity with audit logging
 *
 * @param {string} productId
 * @param {number} adjustmentAmount - Positive for restock, negative for deduction
 * @param {string} changeType - 'restock', 'sale', 'adjustment', 'return'
 * @param {string} referenceId - Order ID or PO Number
 * @param {string} notes
 * @param {string} performedBy
 */
async function adjustStock(productId, adjustmentAmount, changeType, referenceId = null, notes = '', performedBy = 'system') {
  return withTransaction(async (client) => {
    // Lock row for update
    const productRes = await client.query('SELECT id, stock_quantity, low_stock_threshold FROM products WHERE id = $1 FOR UPDATE', [productId]);
    if (productRes.rowCount === 0) {
      throw new Error(`Product with ID '${productId}' not found`);
    }

    const currentStock = productRes.rows[0].stock_quantity;
    const newStock = Math.max(0, currentStock + adjustmentAmount);
    const inStock = newStock > 0;

    await client.query(
      `UPDATE products SET stock_quantity = $1, in_stock = $2 WHERE id = $3`,
      [newStock, inStock, productId]
    );

    const logRes = await client.query(
      `INSERT INTO inventory_logs (product_id, change_type, quantity_changed, previous_quantity, new_quantity, reference_id, notes, performed_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [productId, changeType, adjustmentAmount, currentStock, newStock, referenceId, notes, performedBy]
    );

    if (newStock <= productRes.rows[0].low_stock_threshold) {
      logger.warn('Product has reached or fallen below low-stock threshold!', {
        productId,
        newStock,
        threshold: productRes.rows[0].low_stock_threshold
      });
    }

    return {
      productId,
      previousQuantity: currentStock,
      newQuantity: newStock,
      log: logRes.rows[0]
    };
  });
}

/**
 * Get inventory audit log history
 */
async function getInventoryLogs(productId = null, limit = 50) {
  let sql = `
    SELECT l.*, p.name as product_name, p.sku
    FROM inventory_logs l
    JOIN products p ON l.product_id = p.id
  `;
  const params = [];

  if (productId) {
    sql += ' WHERE l.product_id = $1';
    params.push(productId);
  }

  sql += ' ORDER BY l.created_at DESC LIMIT $' + (params.length + 1);
  params.push(limit);

  const res = await query(sql, params);
  return res.rows;
}

module.exports = {
  getLowStockAlerts,
  adjustStock,
  getInventoryLogs
};
