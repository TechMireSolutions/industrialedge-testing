const { query } = require('../config/db');

const DEFAULT_SETTINGS = {
  seo: {
    siteTitle: 'Industrial Edge Pakistan | Premier B2B & Industrial Procurement',
    metaDescription: 'Pakistan\'s leading corporate procurement platform for heavy equipment, tools, electrical supplies, PPE, and corporate workplace gear.',
    keywords: 'industrial supplies, b2b procurement, wholesale tools, safety equipment karachi, electrical components pakistan',
    openGraphImage: '/images/og-industrial-edge.webp',
    robotsIndex: true,
    canonicalUrl: 'https://industrialedge.pk'
  },
  checkout: {
    requireZipCode: false, // Streamlined checkout (no zip code required as per specs)
    requireNtnNumber: false,
    requirePoNumber: false,
    allowGuestCheckout: true,
    defaultPaymentMethod: 'Corporate Invoice / PO',
    gstPercentage: 18.00,
    isTaxInclusive: false
  },
  company: {
    name: 'Industrial Edge',
    tagline: 'Total Corporate & Industrial Procurement Solutions',
    phone: '+92 332 2316225',
    whatsapp: '923322316225',
    email: 'info@industrialedge.pk',
    address: 'Suite M-107 Odeon Center Regal chowk saddar Karachi, Pakistan',
    googleMapsUrl: 'https://maps.app.goo.gl/52dT7YxfarFZ4nPQ7',
    announcementText: 'Corporate Discounts available on bulk annual contracts across Pakistan!',
    announcementActive: true
  }
};

/**
 * Get all global settings
 */
async function getAllSettings() {
  const res = await query('SELECT key, value, description, updated_at FROM global_settings');
  const settingsMap = { ...DEFAULT_SETTINGS };

  for (const row of res.rows) {
    settingsMap[row.key] = row.value;
  }

  return settingsMap;
}

/**
 * Get setting by group key ('seo', 'checkout', 'company')
 */
async function getSettingByKey(key) {
  const res = await query('SELECT value FROM global_settings WHERE key = $1', [key]);
  if (res.rowCount > 0) {
    return res.rows[0].value;
  }
  return DEFAULT_SETTINGS[key] || {};
}

/**
 * Update setting group
 */
async function updateSettingByKey(key, value, description = null) {
  const current = await getSettingByKey(key);
  const merged = { ...current, ...value };

  const sql = `
    INSERT INTO global_settings (key, value, description)
    VALUES ($1, $2, $3)
    ON CONFLICT (key) DO UPDATE SET
      value = EXCLUDED.value,
      description = COALESCE(EXCLUDED.description, global_settings.description),
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
  const res = await query(sql, [key, JSON.stringify(merged), description]);
  return res.rows[0].value;
}

module.exports = {
  getAllSettings,
  getSettingByKey,
  updateSettingByKey,
  DEFAULT_SETTINGS
};
