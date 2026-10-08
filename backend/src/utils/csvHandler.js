const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

/**
 * Expected product CSV header mapping
 */
const REQUIRED_CSV_FIELDS = ['name', 'category_id', 'price'];

/**
 * Parse CSV buffer into validated product records
 * @param {Buffer|string} csvContent
 * @returns {{ validRows: Array, errors: Array }}
 */
function parseProductCsv(csvContent) {
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const validRows = [];
  const errors = [];

  records.forEach((row, index) => {
    const rowNum = index + 2; // +1 for 0-index, +1 for header line
    const rowErrors = [];

    // Check required fields
    for (const field of REQUIRED_CSV_FIELDS) {
      if (!row[field] || row[field].trim() === '') {
        rowErrors.push(`Missing required field '${field}'`);
      }
    }

    const price = parseFloat(row.price);
    if (isNaN(price) || price < 0) {
      rowErrors.push(`Invalid price '${row.price}': must be a positive number`);
    }

    const originalPrice = row.original_price ? parseFloat(row.original_price) : null;
    const stockQuantity = row.stock_quantity ? parseInt(row.stock_quantity, 10) : 0;
    const lowStockThreshold = row.low_stock_threshold ? parseInt(row.low_stock_threshold, 10) : 5;
    const minOrderQty = row.min_order_qty ? parseInt(row.min_order_qty, 10) : 1;
    const flatShippingFee = row.flat_shipping_fee ? parseFloat(row.flat_shipping_fee) : 0.00;

    let specifications = {};
    if (row.specifications) {
      try {
        specifications = typeof row.specifications === 'string' && row.specifications.startsWith('{')
          ? JSON.parse(row.specifications)
          : { spec: row.specifications };
      } catch {
        specifications = { note: row.specifications };
      }
    }

    if (rowErrors.length > 0) {
      errors.push({ row: rowNum, errors: rowErrors, data: row });
    } else {
      validRows.push({
        sku: row.sku || null, // if omitted, automated SKU generator will create one
        name: row.name.trim(),
        slug: row.slug ? row.slug.trim() : null, // if omitted, slug generator will create one
        category_id: row.category_id.trim(),
        subcategory_id: row.subcategory_id ? row.subcategory_id.trim() : null,
        price,
        original_price: originalPrice,
        stock_quantity: Math.max(0, stockQuantity),
        low_stock_threshold: Math.max(0, lowStockThreshold),
        min_order_qty: Math.max(1, minOrderQty),
        unit: row.unit || 'Piece',
        in_stock: row.in_stock !== 'false' && row.in_stock !== false,
        is_featured: row.is_featured === 'true' || row.is_featured === true,
        is_new: row.is_new === 'true' || row.is_new === true,
        flat_shipping_fee: flatShippingFee,
        description: row.description || '',
        specifications,
        meta_title: row.meta_title || row.name,
        meta_description: row.meta_description || row.description?.slice(0, 160) || ''
      });
    }
  });

  return { validRows, errors };
}

/**
 * Generate CSV string from list of products
 * @param {Array<Object>} products
 * @returns {string}
 */
function exportProductsToCsv(products) {
  const formattedRows = products.map((p) => ({
    sku: p.sku || '',
    name: p.name || '',
    slug: p.slug || '',
    category_id: p.category_id || '',
    subcategory_id: p.subcategory_id || '',
    price: p.price,
    original_price: p.original_price || '',
    stock_quantity: p.stock_quantity ?? 0,
    low_stock_threshold: p.low_stock_threshold ?? 5,
    min_order_qty: p.min_order_qty ?? 1,
    unit: p.unit || 'Piece',
    in_stock: p.in_stock ? 'true' : 'false',
    is_featured: p.is_featured ? 'true' : 'false',
    flat_shipping_fee: p.flat_shipping_fee || 0,
    description: p.description || '',
    specifications: JSON.stringify(p.specifications || {})
  }));

  return stringify(formattedRows, {
    header: true,
    quoted_string: true
  });
}

module.exports = {
  parseProductCsv,
  exportProductsToCsv
};
