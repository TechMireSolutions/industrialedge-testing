const { query } = require('../config/db');

/**
 * List all supported currencies
 */
async function listCurrencies() {
  const res = await query('SELECT * FROM currencies ORDER BY is_default DESC, code ASC');
  return res.rows;
}

/**
 * Get active default currency
 */
async function getDefaultCurrency() {
  const res = await query('SELECT * FROM currencies WHERE is_default = TRUE LIMIT 1');
  return res.rows[0] || { code: 'PKR', symbol: 'Rs.', exchange_rate: 1.0, format_token: '{symbol} {amount}' };
}

/**
 * Create or update currency definition
 */
async function upsertCurrency(data) {
  const { code, name, symbol, exchange_rate, is_default, is_active, format_token } = data;

  if (is_default) {
    await query('UPDATE currencies SET is_default = FALSE');
  }

  const sql = `
    INSERT INTO currencies (code, name, symbol, exchange_rate, is_default, is_active, format_token)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (code) DO UPDATE SET
      name = EXCLUDED.name,
      symbol = EXCLUDED.symbol,
      exchange_rate = EXCLUDED.exchange_rate,
      is_default = EXCLUDED.is_default,
      is_active = EXCLUDED.is_active,
      format_token = EXCLUDED.format_token,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
  const res = await query(sql, [
    code.toUpperCase().trim(),
    name,
    symbol,
    exchange_rate || 1.0,
    is_default || false,
    is_active !== undefined ? is_active : true,
    format_token || '{symbol} {amount}'
  ]);
  return res.rows[0];
}

/**
 * Convert an amount from base currency (PKR) to specified target currency
 */
async function convertAmount(amountInBase, targetCurrencyCode) {
  if (!targetCurrencyCode || targetCurrencyCode === 'PKR') {
    return {
      currency: 'PKR',
      symbol: 'Rs.',
      amount: amountInBase,
      formatted: `Rs. ${amountInBase.toLocaleString()}`
    };
  }

  const res = await query('SELECT * FROM currencies WHERE code = $1 AND is_active = TRUE', [targetCurrencyCode.toUpperCase()]);
  if (res.rowCount === 0) {
    return {
      currency: 'PKR',
      symbol: 'Rs.',
      amount: amountInBase,
      formatted: `Rs. ${amountInBase.toLocaleString()}`
    };
  }

  const curr = res.rows[0];
  const converted = amountInBase / parseFloat(curr.exchange_rate);
  const formatted = curr.format_token.replace('{symbol}', curr.symbol).replace('{amount}', converted.toFixed(2));

  return {
    currency: curr.code,
    symbol: curr.symbol,
    exchangeRate: parseFloat(curr.exchange_rate),
    amount: parseFloat(converted.toFixed(2)),
    formatted
  };
}

/**
 * List B2B volume pricing tiers
 */
async function listB2BTiers(productId = null) {
  let sql = `
    SELECT t.*, p.name as product_name, p.sku
    FROM b2b_price_tiers t
    LEFT JOIN products p ON t.product_id = p.id
  `;
  const params = [];

  if (productId) {
    sql += ' WHERE t.product_id = $1';
    params.push(productId);
  }

  sql += ' ORDER BY t.min_quantity ASC';
  const res = await query(sql, params);
  return res.rows;
}

/**
 * Create or assign a B2B volume discount tier
 */
async function createB2BTier(data) {
  const sql = `
    INSERT INTO b2b_price_tiers (product_id, category_id, min_quantity, max_quantity, discount_percentage, custom_unit_price, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const res = await query(sql, [
    data.product_id || null,
    data.category_id || null,
    data.min_quantity,
    data.max_quantity || null,
    data.discount_percentage || 0,
    data.custom_unit_price || null,
    data.is_active !== undefined ? data.is_active : true
  ]);
  return res.rows[0];
}

/**
 * Delete a B2B price tier
 */
async function deleteB2BTier(id) {
  const res = await query('DELETE FROM b2b_price_tiers WHERE id = $1 RETURNING id', [id]);
  return res.rowCount > 0;
}

/**
 * Calculate dynamic unit price for a given product and purchase quantity
 */
async function calculatePriceForQuantity(productId, quantity) {
  const prodRes = await query('SELECT id, price, category_id FROM products WHERE id = $1', [productId]);
  if (prodRes.rowCount === 0) {
    throw new Error('Product not found');
  }

  const basePrice = parseFloat(prodRes.rows[0].price);
  const categoryId = prodRes.rows[0].category_id;

  // Find most specific tier (matching product_id first, then category_id)
  const tierSql = `
    SELECT * FROM b2b_price_tiers
    WHERE is_active = TRUE
      AND (product_id = $1 OR (product_id IS NULL AND category_id = $2))
      AND min_quantity <= $3
      AND (max_quantity IS NULL OR max_quantity >= $3)
    ORDER BY product_id DESC NULLS LAST, min_quantity DESC
    LIMIT 1
  `;
  const tierRes = await query(tierSql, [productId, categoryId, quantity]);

  let unitPrice = basePrice;
  let discountPercentage = 0;
  let tierApplied = null;

  if (tierRes.rowCount > 0) {
    tierApplied = tierRes.rows[0];
    if (tierApplied.custom_unit_price) {
      unitPrice = parseFloat(tierApplied.custom_unit_price);
      discountPercentage = parseFloat((((basePrice - unitPrice) / basePrice) * 100).toFixed(2));
    } else if (tierApplied.discount_percentage > 0) {
      discountPercentage = parseFloat(tierApplied.discount_percentage);
      unitPrice = parseFloat((basePrice * (1 - discountPercentage / 100)).toFixed(2));
    }
  }

  const subtotal = parseFloat((unitPrice * quantity).toFixed(2));
  const baseSubtotal = parseFloat((basePrice * quantity).toFixed(2));
  const totalSavings = parseFloat((baseSubtotal - subtotal).toFixed(2));

  return {
    productId,
    quantity,
    basePrice,
    unitPrice,
    discountPercentage,
    subtotal,
    totalSavings,
    tierApplied
  };
}

module.exports = {
  listCurrencies,
  getDefaultCurrency,
  upsertCurrency,
  convertAmount,
  listB2BTiers,
  createB2BTier,
  deleteB2BTier,
  calculatePriceForQuantity
};
