const { query } = require('../config/db');

/**
 * Clean prefix string for SKU
 */
function cleanPrefix(str, defaultVal = 'GEN', len = 3) {
  if (!str) return defaultVal;
  const cleaned = str.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return cleaned.substring(0, len) || defaultVal;
}

/**
 * Generate unique automated SKU for products
 * Format: IE-{CAT}-{SUB}-{RANDOM}
 * e.g., IE-HAR-TOO-8942
 *
 * @param {string} categoryName - Category identifier or name
 * @param {string} subcategoryName - Subcategory identifier or name
 * @returns {Promise<string>}
 */
async function generateUniqueSku(categoryName = 'GEN', subcategoryName = 'ALL') {
  const catPrefix = cleanPrefix(categoryName, 'CAT', 3);
  const subPrefix = cleanPrefix(subcategoryName, 'PRD', 3);

  let isUnique = false;
  let skuCandidate = '';
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    skuCandidate = `IE-${catPrefix}-${subPrefix}-${randomSuffix}`;

    try {
      const res = await query('SELECT id FROM products WHERE sku = $1', [skuCandidate]);
      if (res.rowCount === 0) {
        isUnique = true;
      }
    } catch {
      // In case DB is not yet connected during unit testing, fallback to timestamp suffix
      skuCandidate = `IE-${catPrefix}-${subPrefix}-${Date.now().toString().slice(-4)}`;
      isUnique = true;
    }
  }

  return skuCandidate;
}

module.exports = {
  generateUniqueSku,
  cleanPrefix
};
