const { query } = require('../config/db');
const { createSlugString } = require('../utils/slugify');

// ================= CATEGORIES =================
async function listCategories(includeInactive = false) {
  let sql = `
    SELECT c.*,
           (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as products_count,
           COALESCE(
             (SELECT json_agg(json_build_object('id', s.id, 'name', s.name, 'slug', s.slug, 'display_order', s.display_order))
              FROM subcategories s WHERE s.category_id = c.id AND s.is_active = TRUE), '[]'::json
           ) as subcategories
    FROM categories c
  `;
  if (!includeInactive) {
    sql += ' WHERE c.is_active = TRUE';
  }
  sql += ' ORDER BY c.display_order ASC, c.name ASC';
  const res = await query(sql);
  return res.rows;
}

async function getCategoryById(id) {
  const sql = `
    SELECT c.*,
           COALESCE(
             (SELECT json_agg(json_build_object('id', s.id, 'name', s.name, 'slug', s.slug, 'display_order', s.display_order))
              FROM subcategories s WHERE s.category_id = c.id), '[]'::json
           ) as subcategories
    FROM categories c
    WHERE c.id = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
}

async function createCategory(data) {
  const id = data.id || createSlugString(data.name);
  const slug = data.slug || createSlugString(data.name);

  const sql = `
    INSERT INTO categories (id, name, slug, description, icon, is_active, display_order)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const res = await query(sql, [
    id,
    data.name,
    slug,
    data.description || null,
    data.icon || 'LayoutGrid',
    data.is_active !== undefined ? data.is_active : true,
    data.display_order || 0
  ]);
  return res.rows[0];
}

async function updateCategory(id, data) {
  const sql = `
    UPDATE categories SET
      name = COALESCE($1, name),
      slug = COALESCE($2, slug),
      description = COALESCE($3, description),
      icon = COALESCE($4, icon),
      is_active = COALESCE($5, is_active),
      display_order = COALESCE($6, display_order),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $7
    RETURNING *
  `;
  const res = await query(sql, [
    data.name,
    data.slug,
    data.description,
    data.icon,
    data.is_active,
    data.display_order,
    id
  ]);
  return res.rows[0];
}

async function deleteCategory(id) {
  // Check if any product belongs to category
  const check = await query('SELECT COUNT(*) as count FROM products WHERE category_id = $1', [id]);
  if (parseInt(check.rows[0].count, 10) > 0) {
    throw new Error(`Cannot delete category '${id}' because ${check.rows[0].count} product(s) are assigned to it. Reassign products first.`);
  }

  const res = await query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
  return res.rowCount > 0;
}

// ================= SUBCATEGORIES =================
async function createSubcategory(data) {
  const id = data.id || `${data.category_id}-${createSlugString(data.name)}`;
  const slug = data.slug || createSlugString(data.name);

  const sql = `
    INSERT INTO subcategories (id, category_id, name, slug, description, is_active, display_order)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const res = await query(sql, [
    id,
    data.category_id,
    data.name,
    slug,
    data.description || null,
    data.is_active !== undefined ? data.is_active : true,
    data.display_order || 0
  ]);
  return res.rows[0];
}

async function deleteSubcategory(id) {
  const res = await query('DELETE FROM subcategories WHERE id = $1 RETURNING id', [id]);
  return res.rowCount > 0;
}

// ================= TAGS =================
async function listTags() {
  const res = await query('SELECT * FROM tags ORDER BY name ASC');
  return res.rows;
}

async function createTag(name) {
  const slug = createSlugString(name);
  const sql = `
    INSERT INTO tags (name, slug)
    VALUES ($1, $2)
    ON CONFLICT (name) DO UPDATE SET slug = EXCLUDED.slug
    RETURNING *
  `;
  const res = await query(sql, [name.trim(), slug]);
  return res.rows[0];
}

async function deleteTag(id) {
  const res = await query('DELETE FROM tags WHERE id = $1 RETURNING id', [id]);
  return res.rowCount > 0;
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  deleteSubcategory,
  listTags,
  createTag,
  deleteTag
};
