const { query, withTransaction } = require('../config/db');
const { generateUniqueSku } = require('../utils/skuGenerator');
const { generateUniqueSlug } = require('../utils/slugify');
const logger = require('../utils/logger');

/**
 * List products with filtering, search, pagination, and sorting
 */
async function listProducts(params = {}) {
  const {
    search,
    category,
    subcategory,
    inStock,
    isFeatured,
    isActive = true,
    page = 1,
    limit = 20,
    sortBy = 'created_at',
    sortOrder = 'DESC'
  } = params;

  const conditions = [];
  const queryParams = [];
  let paramIndex = 1;

  if (isActive !== undefined && isActive !== null) {
    conditions.push(`p.is_active = $${paramIndex++}`);
    queryParams.push(isActive === 'true' || isActive === true);
  }

  if (category && category !== 'all') {
    conditions.push(`p.category_id = $${paramIndex++}`);
    queryParams.push(category);
  }

  if (subcategory) {
    conditions.push(`p.subcategory_id = $${paramIndex++}`);
    queryParams.push(subcategory);
  }

  if (inStock !== undefined && inStock !== null) {
    conditions.push(`p.in_stock = $${paramIndex++}`);
    queryParams.push(inStock === 'true' || inStock === true);
  }

  if (isFeatured !== undefined && isFeatured !== null) {
    conditions.push(`p.is_featured = $${paramIndex++}`);
    queryParams.push(isFeatured === 'true' || isFeatured === true);
  }

  if (search) {
    conditions.push(`(p.name ILIKE $${paramIndex} OR p.sku ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`);
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Count total matching items
  const countSql = `SELECT COUNT(*) as total FROM products p ${whereClause}`;
  const countRes = await query(countSql, queryParams);
  const totalItems = parseInt(countRes.rows[0].total, 10);

  // Allowed sort columns
  const allowedSortCols = ['created_at', 'price', 'name', 'stock_quantity', 'rating'];
  const validSort = allowedSortCols.includes(sortBy) ? sortBy : 'created_at';
  const validOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const offset = (Math.max(1, page) - 1) * limit;

  const listSql = `
    SELECT p.*,
           c.name as category_name,
           s.name as subcategory_name,
           (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image,
           (SELECT json_agg(json_build_object('id', pi.id, 'image_url', pi.image_url, 'is_primary', pi.is_primary, 'display_order', pi.display_order))
            FROM product_images pi WHERE pi.product_id = p.id) as images
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories s ON p.subcategory_id = s.id
    ${whereClause}
    ORDER BY p.${validSort} ${validOrder}
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;

  queryParams.push(limit, offset);
  const listRes = await query(listSql, queryParams);

  return {
    items: listRes.rows,
    pagination: {
      total: totalItems,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(totalItems / limit)
    }
  };
}

/**
 * Retrieve single product by ID with full associations
 */
async function getProductById(id) {
  const sql = `
    SELECT p.*,
           c.name as category_name,
           s.name as subcategory_name,
           COALESCE(
             (SELECT json_agg(json_build_object('id', pi.id, 'image_url', pi.image_url, 'webp_url', pi.webp_url, 'alt_text', pi.alt_text, 'is_primary', pi.is_primary, 'display_order', pi.display_order) ORDER BY pi.display_order ASC)
              FROM product_images pi WHERE pi.product_id = p.id), '[]'::json
           ) as images,
           COALESCE(
             (SELECT json_agg(json_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
              FROM product_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.product_id = p.id), '[]'::json
           ) as tags,
           COALESCE(
             (SELECT json_agg(json_build_object('id', pt.id, 'min_quantity', pt.min_quantity, 'max_quantity', pt.max_quantity, 'discount_percentage', pt.discount_percentage, 'custom_unit_price', pt.custom_unit_price) ORDER BY pt.min_quantity ASC)
              FROM b2b_price_tiers pt WHERE pt.product_id = p.id AND pt.is_active = TRUE), '[]'::json
           ) as b2b_tiers
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories s ON p.subcategory_id = s.id
    WHERE p.id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
}

/**
 * Retrieve single product by dynamic SEO slug
 */
async function getProductBySlug(slug) {
  const sql = `
    SELECT p.*,
           c.name as category_name,
           s.name as subcategory_name,
           COALESCE(
             (SELECT json_agg(json_build_object('id', pi.id, 'image_url', pi.image_url, 'webp_url', pi.webp_url, 'alt_text', pi.alt_text, 'is_primary', pi.is_primary, 'display_order', pi.display_order) ORDER BY pi.display_order ASC)
              FROM product_images pi WHERE pi.product_id = p.id), '[]'::json
           ) as images,
           COALESCE(
             (SELECT json_agg(json_build_object('id', pt.id, 'min_quantity', pt.min_quantity, 'max_quantity', pt.max_quantity, 'discount_percentage', pt.discount_percentage, 'custom_unit_price', pt.custom_unit_price) ORDER BY pt.min_quantity ASC)
              FROM b2b_price_tiers pt WHERE pt.product_id = p.id AND pt.is_active = TRUE), '[]'::json
           ) as b2b_tiers
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories s ON p.subcategory_id = s.id
    WHERE p.slug = $1 AND p.is_active = TRUE
  `;
  const res = await query(sql, [slug]);
  return res.rows[0] || null;
}

/**
 * Create a new product with automated SKU & Slug triggers
 */
async function createProduct(data, adminUser = 'system') {
  return withTransaction(async (client) => {
    const id = data.id || `prod-${Date.now()}`;

    // Automated SKU Generation trigger if not supplied
    const sku = data.sku || (await generateUniqueSku(data.category_id, data.subcategory_id));

    // Dynamic SEO Slug Generation trigger with duplicate collision avoidance
    const slug = await generateUniqueSlug(data.slug || data.name, 'products');

    const inStock = data.stock_quantity !== undefined ? data.stock_quantity > 0 : (data.inStock ?? true);

    const productSql = `
      INSERT INTO products (
        id, sku, name, slug, category_id, subcategory_id, price, original_price,
        cost_price, stock_quantity, low_stock_threshold, min_order_qty, unit,
        in_stock, is_featured, is_new, is_active, flat_shipping_fee, rating,
        reviews_count, description, specifications, meta_title, meta_description, meta_keywords
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24, $25
      ) RETURNING *
    `;

    const productParams = [
      id,
      sku,
      data.name,
      slug,
      data.category_id,
      data.subcategory_id || null,
      data.price,
      data.original_price || null,
      data.cost_price || 0,
      data.stock_quantity || 0,
      data.low_stock_threshold || 5,
      data.min_order_qty || 1,
      data.unit || 'Piece',
      inStock,
      data.is_featured || false,
      data.is_new || false,
      data.is_active !== undefined ? data.is_active : true,
      data.flat_shipping_fee || 0.00,
      data.rating || 5.0,
      data.reviews_count || 0,
      data.description || '',
      JSON.stringify(data.specifications || {}),
      data.meta_title || data.name,
      data.meta_description || data.description?.slice(0, 160) || '',
      data.meta_keywords || ''
    ];

    const result = await client.query(productSql, productParams);
    const newProduct = result.rows[0];

    // Insert gallery images if provided
    if (data.images && Array.isArray(data.images)) {
      for (let i = 0; i < data.images.length; i++) {
        const img = data.images[i];
        const imgUrl = typeof img === 'string' ? img : img.image_url;
        await client.query(
          `INSERT INTO product_images (product_id, image_url, webp_url, alt_text, is_primary, display_order)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, imgUrl, img.webp_url || imgUrl, img.alt_text || data.name, i === 0, i]
        );
      }
    } else if (data.image) {
      // Legacy single image support
      await client.query(
        `INSERT INTO product_images (product_id, image_url, is_primary, display_order)
         VALUES ($1, $2, TRUE, 0)`,
        [id, data.image]
      );
    }

    // Log initial inventory
    await client.query(
      `INSERT INTO inventory_logs (product_id, change_type, quantity_changed, previous_quantity, new_quantity, reference_id, notes, performed_by)
       VALUES ($1, 'initial', $2, 0, $2, 'INITIAL_SETUP', 'Initial catalog inventory allocation', $3)`,
      [id, data.stock_quantity || 0, adminUser]
    );

    return newProduct;
  });
}

/**
 * Update existing product with optional dynamic slug override
 */
async function updateProduct(id, updates, adminUser = 'system') {
  return withTransaction(async (client) => {
    const currentRes = await client.query('SELECT * FROM products WHERE id = $1', [id]);
    if (currentRes.rowCount === 0) {
      throw new Error(`Product with ID '${id}' not found`);
    }
    const current = currentRes.rows[0];

    let slug = current.slug;
    if (updates.slug && updates.slug !== current.slug) {
      slug = await generateUniqueSlug(updates.slug, 'products', id);
    } else if (updates.name && updates.name !== current.name && !updates.slug) {
      slug = await generateUniqueSlug(updates.name, 'products', id);
    }

    // Stock change check
    const newStock = updates.stock_quantity !== undefined ? parseInt(updates.stock_quantity, 10) : current.stock_quantity;
    const inStock = newStock > 0;

    if (updates.stock_quantity !== undefined && newStock !== current.stock_quantity) {
      const diff = newStock - current.stock_quantity;
      await client.query(
        `INSERT INTO inventory_logs (product_id, change_type, quantity_changed, previous_quantity, new_quantity, reference_id, notes, performed_by)
         VALUES ($1, 'adjustment', $2, $3, $4, 'ADMIN_MANUAL_UPDATE', 'Stock adjusted via Admin Panel', $5)`,
        [id, diff, current.stock_quantity, newStock, adminUser]
      );
    }

    const updateSql = `
      UPDATE products SET
        sku = COALESCE($1, sku),
        name = COALESCE($2, name),
        slug = $3,
        category_id = COALESCE($4, category_id),
        subcategory_id = COALESCE($5, subcategory_id),
        price = COALESCE($6, price),
        original_price = COALESCE($7, original_price),
        cost_price = COALESCE($8, cost_price),
        stock_quantity = $9,
        low_stock_threshold = COALESCE($10, low_stock_threshold),
        min_order_qty = COALESCE($11, min_order_qty),
        unit = COALESCE($12, unit),
        in_stock = $13,
        is_featured = COALESCE($14, is_featured),
        is_new = COALESCE($15, is_new),
        is_active = COALESCE($16, is_active),
        flat_shipping_fee = COALESCE($17, flat_shipping_fee),
        description = COALESCE($18, description),
        specifications = COALESCE($19, specifications),
        meta_title = COALESCE($20, meta_title),
        meta_description = COALESCE($21, meta_description),
        meta_keywords = COALESCE($22, meta_keywords)
      WHERE id = $23
      RETURNING *
    `;

    const params = [
      updates.sku,
      updates.name,
      slug,
      updates.category_id,
      updates.subcategory_id,
      updates.price,
      updates.original_price,
      updates.cost_price,
      newStock,
      updates.low_stock_threshold,
      updates.min_order_qty,
      updates.unit,
      inStock,
      updates.is_featured,
      updates.is_new,
      updates.is_active,
      updates.flat_shipping_fee,
      updates.description,
      updates.specifications ? JSON.stringify(updates.specifications) : null,
      updates.meta_title,
      updates.meta_description,
      updates.meta_keywords,
      id
    ];

    const result = await client.query(updateSql, params);

    // Update images if provided
    if (updates.images && Array.isArray(updates.images)) {
      await client.query('DELETE FROM product_images WHERE product_id = $1', [id]);
      for (let i = 0; i < updates.images.length; i++) {
        const img = updates.images[i];
        const imgUrl = typeof img === 'string' ? img : img.image_url;
        await client.query(
          `INSERT INTO product_images (product_id, image_url, webp_url, alt_text, is_primary, display_order)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [id, imgUrl, img.webp_url || imgUrl, img.alt_text || updates.name || current.name, i === 0, i]
        );
      }
    }

    return result.rows[0];
  });
}

/**
 * Duplicate a product creating an independent clone
 */
async function duplicateProduct(sourceId, adminUser = 'system') {
  return withTransaction(async (client) => {
    const srcRes = await client.query('SELECT * FROM products WHERE id = $1', [sourceId]);
    if (srcRes.rowCount === 0) {
      throw new Error(`Source product with ID '${sourceId}' not found`);
    }
    const src = srcRes.rows[0];

    const newId = `prod-${Date.now()}`;
    const newSku = await generateUniqueSku(src.category_id, src.subcategory_id);
    const newName = `${src.name} (Copy)`;
    const newSlug = await generateUniqueSlug(`${src.slug}-copy`, 'products');

    const insertSql = `
      INSERT INTO products (
        id, sku, name, slug, category_id, subcategory_id, price, original_price,
        cost_price, stock_quantity, low_stock_threshold, min_order_qty, unit,
        in_stock, is_featured, is_new, is_active, flat_shipping_fee, description,
        specifications, meta_title, meta_description
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13,
        $14, false, true, true, $15, $16,
        $17, $18, $19
      ) RETURNING *
    `;

    const res = await client.query(insertSql, [
      newId,
      newSku,
      newName,
      newSlug,
      src.category_id,
      src.subcategory_id,
      src.price,
      src.original_price,
      src.cost_price,
      src.stock_quantity,
      src.low_stock_threshold,
      src.min_order_qty,
      src.unit,
      src.stock_quantity > 0,
      src.flat_shipping_fee,
      src.description,
      JSON.stringify(src.specifications || {}),
      newName,
      src.meta_description
    ]);

    // Copy images
    const imagesRes = await client.query('SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order ASC', [sourceId]);
    for (const img of imagesRes.rows) {
      await client.query(
        `INSERT INTO product_images (product_id, image_url, webp_url, alt_text, is_primary, display_order)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [newId, img.image_url, img.webp_url, img.alt_text, img.is_primary, img.display_order]
      );
    }

    logger.info('Product duplicated successfully', { sourceId, newId, newSku });
    return res.rows[0];
  });
}

/**
 * Delete product by ID
 */
async function deleteProduct(id) {
  const res = await query('DELETE FROM products WHERE id = $1 RETURNING id', [id]);
  return res.rowCount > 0;
}

module.exports = {
  listProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  duplicateProduct,
  deleteProduct
};
