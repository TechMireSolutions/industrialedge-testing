const { query } = require('../config/db');

// ================= BANNERS & ANNOUNCEMENT BARS =================
async function listBanners(bannerType = null, activeOnly = false) {
  let sql = 'SELECT * FROM cms_banners';
  const conditions = [];
  const params = [];

  if (bannerType) {
    params.push(bannerType);
    conditions.push(`banner_type = $${params.length}`);
  }
  if (activeOnly) {
    conditions.push('is_active = TRUE');
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY display_order ASC, created_at DESC';
  const res = await query(sql, params);
  return res.rows;
}

async function createBanner(data) {
  const sql = `
    INSERT INTO cms_banners (title, subtitle, badge, price, original_price, image_url, link_url, slug, banner_type, display_order, is_active)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `;
  const res = await query(sql, [
    data.title,
    data.subtitle || null,
    data.badge || null,
    data.price || null,
    data.original_price || null,
    data.image_url,
    data.link_url || null,
    data.slug || null,
    data.banner_type || 'hero_slider',
    data.display_order || 0,
    data.is_active !== undefined ? data.is_active : true
  ]);
  return res.rows[0];
}

async function updateBanner(id, data) {
  const sql = `
    UPDATE cms_banners SET
      title = COALESCE($1, title),
      subtitle = COALESCE($2, subtitle),
      badge = COALESCE($3, badge),
      price = COALESCE($4, price),
      original_price = COALESCE($5, original_price),
      image_url = COALESCE($6, image_url),
      link_url = COALESCE($7, link_url),
      slug = COALESCE($8, slug),
      banner_type = COALESCE($9, banner_type),
      display_order = COALESCE($10, display_order),
      is_active = COALESCE($11, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $12
    RETURNING *
  `;
  const res = await query(sql, [
    data.title,
    data.subtitle,
    data.badge,
    data.price,
    data.original_price,
    data.image_url,
    data.link_url,
    data.slug,
    data.banner_type,
    data.display_order,
    data.is_active,
    id
  ]);
  return res.rows[0];
}

async function deleteBanner(id) {
  const res = await query('DELETE FROM cms_banners WHERE id = $1 RETURNING id', [id]);
  return res.rowCount > 0;
}

// ================= CORPORATE / B2B PORTAL CONTENT =================
async function getCorporateSections() {
  const res = await query('SELECT * FROM cms_corporate_sections WHERE is_active = TRUE ORDER BY display_order ASC');
  return res.rows;
}

async function upsertCorporateSection(sectionKey, data) {
  const sql = `
    INSERT INTO cms_corporate_sections (section_key, title, subtitle, content, image_url, is_active)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (section_key) DO UPDATE SET
      title = EXCLUDED.title,
      subtitle = EXCLUDED.subtitle,
      content = EXCLUDED.content,
      image_url = EXCLUDED.image_url,
      is_active = EXCLUDED.is_active,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
  const res = await query(sql, [
    sectionKey,
    data.title,
    data.subtitle || null,
    JSON.stringify(data.content || {}),
    data.image_url || null,
    data.is_active !== undefined ? data.is_active : true
  ]);
  return res.rows[0];
}

// ================= FAQS =================
async function listFaqs(category = null, activeOnly = false) {
  let sql = 'SELECT * FROM cms_faqs';
  const conditions = [];
  const params = [];

  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }
  if (activeOnly) {
    conditions.push('is_active = TRUE');
  }
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY display_order ASC, created_at ASC';
  const res = await query(sql, params);
  return res.rows;
}

async function createFaq(data) {
  const sql = `
    INSERT INTO cms_faqs (category, question, answer, display_order, is_active)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const res = await query(sql, [
    data.category || 'General',
    data.question,
    data.answer,
    data.display_order || 0,
    data.is_active !== undefined ? data.is_active : true
  ]);
  return res.rows[0];
}

async function updateFaq(id, data) {
  const sql = `
    UPDATE cms_faqs SET
      category = COALESCE($1, category),
      question = COALESCE($2, question),
      answer = COALESCE($3, answer),
      display_order = COALESCE($4, display_order),
      is_active = COALESCE($5, is_active),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
    RETURNING *
  `;
  const res = await query(sql, [data.category, data.question, data.answer, data.display_order, data.is_active, id]);
  return res.rows[0];
}

async function deleteFaq(id) {
  const res = await query('DELETE FROM cms_faqs WHERE id = $1 RETURNING id', [id]);
  return res.rowCount > 0;
}

// ================= POLICY & STATIC PAGES =================
async function listPolicyPages(publishedOnly = false) {
  let sql = 'SELECT id, slug, title, is_published, meta_title, updated_at FROM cms_policy_pages';
  if (publishedOnly) {
    sql += ' WHERE is_published = TRUE';
  }
  sql += ' ORDER BY title ASC';
  const res = await query(sql);
  return res.rows;
}

async function getPolicyPageBySlug(slug) {
  const res = await query('SELECT * FROM cms_policy_pages WHERE slug = $1', [slug]);
  return res.rows[0] || null;
}

async function upsertPolicyPage(data) {
  const sql = `
    INSERT INTO cms_policy_pages (slug, title, content, is_published, meta_title, meta_description)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (slug) DO UPDATE SET
      title = EXCLUDED.title,
      content = EXCLUDED.content,
      is_published = EXCLUDED.is_published,
      meta_title = EXCLUDED.meta_title,
      meta_description = EXCLUDED.meta_description,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
  const res = await query(sql, [
    data.slug,
    data.title,
    data.content,
    data.is_published !== undefined ? data.is_published : true,
    data.meta_title || data.title,
    data.meta_description || null
  ]);
  return res.rows[0];
}

async function deletePolicyPage(id) {
  const res = await query('DELETE FROM cms_policy_pages WHERE id = $1 RETURNING id', [id]);
  return res.rowCount > 0;
}

module.exports = {
  listBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getCorporateSections,
  upsertCorporateSection,
  listFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  listPolicyPages,
  getPolicyPageBySlug,
  upsertPolicyPage,
  deletePolicyPage
};
