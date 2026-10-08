const { parseProductCsv, exportProductsToCsv } = require('../utils/csvHandler');
const { query, withTransaction } = require('../config/db');
const { generateUniqueSku } = require('../utils/skuGenerator');
const { generateUniqueSlug } = require('../utils/slugify');
const logger = require('../utils/logger');

/**
 * Transactional bulk CSV catalog import
 */
async function importProductsCsv(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ success: false, message: 'Please upload a valid CSV file' });
    }

    const { validRows, errors } = parseProductCsv(req.file.buffer);

    if (errors.length > 0 && validRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'CSV parsing failed with critical row errors',
        errors
      });
    }

    const adminUser = req.user ? req.user.email : 'csv_import';
    const importedProducts = [];

    // Execute import in an atomic transaction
    await withTransaction(async (client) => {
      for (const row of validRows) {
        const id = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const sku = row.sku || (await generateUniqueSku(row.category_id, row.subcategory_id));
        const slug = row.slug ? await generateUniqueSlug(row.slug, 'products') : await generateUniqueSlug(row.name, 'products');

        // Check if category exists, if not, auto-create it
        await client.query(
          `INSERT INTO categories (id, name, slug) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
          [row.category_id, row.category_id.replace(/-/g, ' ').toUpperCase(), row.category_id]
        );

        const insertSql = `
          INSERT INTO products (
            id, sku, name, slug, category_id, subcategory_id, price, original_price,
            stock_quantity, low_stock_threshold, min_order_qty, unit, in_stock,
            is_featured, is_new, flat_shipping_fee, description, specifications,
            meta_title, meta_description
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12, $13,
            $14, $15, $16, $17, $18,
            $19, $20
          )
          ON CONFLICT (sku) DO UPDATE SET
            name = EXCLUDED.name,
            price = EXCLUDED.price,
            stock_quantity = EXCLUDED.stock_quantity,
            description = EXCLUDED.description,
            updated_at = CURRENT_TIMESTAMP
          RETURNING id, sku, name
        `;

        const resProd = await client.query(insertSql, [
          id,
          sku,
          row.name,
          slug,
          row.category_id,
          row.subcategory_id,
          row.price,
          row.original_price,
          row.stock_quantity,
          row.low_stock_threshold,
          row.min_order_qty,
          row.unit,
          row.in_stock,
          row.is_featured,
          row.is_new,
          row.flat_shipping_fee,
          row.description,
          JSON.stringify(row.specifications),
          row.meta_title,
          row.meta_description
        ]);

        importedProducts.push(resProd.rows[0]);

        // Inventory log
        await client.query(
          `INSERT INTO inventory_logs (product_id, change_type, quantity_changed, previous_quantity, new_quantity, reference_id, notes, performed_by)
           VALUES ($1, 'restock', $2, 0, $2, 'CSV_BULK_IMPORT', 'Imported via CSV file', $3)`,
          [resProd.rows[0].id, row.stock_quantity, adminUser]
        );
      }
    });

    res.json({
      success: true,
      message: `Successfully processed CSV: ${importedProducts.length} product(s) imported/updated.`,
      importedCount: importedProducts.length,
      skippedErrorsCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      sampleImported: importedProducts.slice(0, 5)
    });
  } catch (error) {
    logger.error('CSV Import Transaction failed', { error: error.message });
    next(error);
  }
}

/**
 * Export catalog products to CSV
 */
async function exportProductsCsv(req, res, next) {
  try {
    const listRes = await query('SELECT * FROM products ORDER BY created_at DESC');
    const csvString = exportProductsToCsv(listRes.rows);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="industrial_edge_catalog_${Date.now()}.csv"`);
    res.status(200).send(csvString);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  importProductsCsv,
  exportProductsCsv
};
