const { query } = require('../config/db');

/**
 * List all regional delivery rules
 */
async function listShippingRules() {
  const res = await query('SELECT * FROM shipping_rules ORDER BY region_name ASC');
  return res.rows;
}

/**
 * Create or update regional shipping rule
 */
async function upsertShippingRule(data) {
  if (data.id) {
    const res = await query(
      `UPDATE shipping_rules
       SET region_name = $1, base_flat_rate = $2, free_shipping_threshold = $3,
           estimated_delivery_days = $4, is_active = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [data.region_name, data.base_flat_rate, data.free_shipping_threshold, data.estimated_delivery_days, data.is_active, data.id]
    );
    return res.rows[0];
  }

  const res = await query(
    `INSERT INTO shipping_rules (region_name, base_flat_rate, free_shipping_threshold, estimated_delivery_days, is_active)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [data.region_name, data.base_flat_rate, data.free_shipping_threshold, data.estimated_delivery_days, data.is_active !== undefined ? data.is_active : true]
  );
  return res.rows[0];
}

/**
 * Delete a shipping rule
 */
async function deleteShippingRule(id) {
  const res = await query('DELETE FROM shipping_rules WHERE id = $1 RETURNING id', [id]);
  return res.rowCount > 0;
}

/**
 * Calculate order shipping fee based on destination region and items
 *
 * @param {Array<{ productId: string, quantity: number }>} items
 * @param {string} regionId - Optional specific region UUID
 * @param {string} city - Optional destination city name
 * @param {number} orderSubtotal
 */
async function calculateShippingFee(items, regionId = null, city = null, orderSubtotal = 0) {
  let rule = null;

  if (regionId) {
    const res = await query('SELECT * FROM shipping_rules WHERE id = $1 AND is_active = TRUE', [regionId]);
    if (res.rowCount > 0) rule = res.rows[0];
  }

  if (!rule && city) {
    // Attempt fuzzy matching city to regional rule
    const res = await query(
      `SELECT * FROM shipping_rules WHERE is_active = TRUE AND region_name ILIKE $1 LIMIT 1`,
      [`%${city}%`]
    );
    if (res.rowCount > 0) rule = res.rows[0];
  }

  // Fallback to default active rule if no specific region matched
  if (!rule) {
    const res = await query('SELECT * FROM shipping_rules WHERE is_active = TRUE ORDER BY base_flat_rate ASC LIMIT 1');
    rule = res.rows[0] || { base_flat_rate: '350.00', free_shipping_threshold: '50000.00', estimated_delivery_days: '2-4 Days' };
  }

  const baseRate = parseFloat(rule.base_flat_rate);
  const freeThreshold = parseFloat(rule.free_shipping_threshold || 0);

  // Check if order qualifies for regional free shipping threshold
  if (freeThreshold > 0 && orderSubtotal >= freeThreshold) {
    return {
      shippingFee: 0,
      isFreeShipping: true,
      reason: `Free corporate shipping applied (Order subtotal exceeds Rs. ${freeThreshold.toLocaleString()})`,
      region: rule.region_name || 'Standard',
      estimatedDelivery: rule.estimated_delivery_days
    };
  }

  // Calculate product-level special shipping fees if any item carries individual freight
  let productFreightTotal = 0;
  if (items && items.length > 0) {
    const productIds = items.map((it) => it.productId || it.product_id).filter(Boolean);
    if (productIds.length > 0) {
      const prodRes = await query('SELECT id, flat_shipping_fee FROM products WHERE id = ANY($1)', [productIds]);
      const feeMap = new Map(prodRes.rows.map((r) => [r.id, parseFloat(r.flat_shipping_fee || 0)]));

      for (const item of items) {
        const pId = item.productId || item.product_id;
        const itemFee = feeMap.get(pId) || 0;
        productFreightTotal += itemFee * (item.quantity || 1);
      }
    }
  }

  // Total shipping is base regional rate plus any heavy machinery/product surcharge
  const totalShippingFee = parseFloat((baseRate + productFreightTotal).toFixed(2));

  return {
    shippingFee: totalShippingFee,
    baseRegionalRate: baseRate,
    productFreightSurcharge: productFreightTotal,
    isFreeShipping: false,
    region: rule.region_name || 'Standard',
    estimatedDelivery: rule.estimated_delivery_days
  };
}

module.exports = {
  listShippingRules,
  upsertShippingRule,
  deleteShippingRule,
  calculateShippingFee
};
