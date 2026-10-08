const { query, withTransaction } = require('../config/db');
const { RFQ_STATUS } = require('../config/constants');
const { generateCorporatePdf } = require('../utils/pdfGenerator');
const logger = require('../utils/logger');

/**
 * Generate unique RFQ identifier (e.g., RFQ-84912)
 */
async function generateRfqNumber() {
  let isUnique = false;
  let rfqNumber = '';

  while (!isUnique) {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    rfqNumber = `RFQ-${randomDigits}`;

    const res = await query('SELECT id FROM rfqs WHERE rfq_number = $1', [rfqNumber]);
    if (res.rowCount === 0) {
      isUnique = true;
    }
  }

  return rfqNumber;
}

/**
 * Submit corporate RFQ request
 */
async function submitRfq(data) {
  return withTransaction(async (client) => {
    const rfqNumber = await generateRfqNumber();
    const rfqId = `rfq-${Date.now()}`;

    // Upsert customer
    let customerId = null;
    if (data.email) {
      const custRes = await client.query(
        `INSERT INTO customers (email, full_name, company_name, phone, ntn_number, shipping_address)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO UPDATE SET
           company_name = COALESCE(EXCLUDED.company_name, customers.company_name),
           phone = COALESCE(EXCLUDED.phone, customers.phone),
           ntn_number = COALESCE(EXCLUDED.ntn_number, customers.ntn_number)
         RETURNING id`,
        [
          data.email.toLowerCase().trim(),
          data.contactPerson || 'Procurement Inquirer',
          data.companyName,
          data.phone,
          data.ntnNumber || null,
          data.deliveryLocation
        ]
      );
      customerId = custRes.rows[0].id;
    }

    const insertSql = `
      INSERT INTO rfqs (
        id, rfq_number, customer_id, company_name, contact_person, email, phone,
        ntn_number, delivery_location, required_by_date, status, notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12
      ) RETURNING *
    `;

    const rfqRes = await client.query(insertSql, [
      rfqId,
      rfqNumber,
      customerId,
      data.companyName,
      data.contactPerson,
      data.email.toLowerCase().trim(),
      data.phone,
      data.ntnNumber || null,
      data.deliveryLocation,
      data.requiredByDate || null,
      RFQ_STATUS.SUBMITTED,
      data.notes || null
    ]);

    const createdRfq = rfqRes.rows[0];

    // Insert items
    for (const item of data.items || []) {
      await client.query(
        `INSERT INTO rfq_items (rfq_id, product_id, product_name, sku, requested_qty, unit, target_budget, negotiation_notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          rfqId,
          item.productId || null,
          item.productName || item.name,
          item.sku || null,
          item.requestedQty || item.quantity,
          item.unit || 'Unit',
          item.targetBudget || null,
          item.notes || null
        ]
      );
    }

    return createdRfq;
  });
}

/**
 * List RFQs for Admin Hub with status filter
 */
async function listRfqs(params = {}) {
  const { status, search, page = 1, limit = 20 } = params;
  const conditions = [];
  const queryParams = [];
  let paramIndex = 1;

  if (status && status !== 'All') {
    conditions.push(`r.status = $${paramIndex++}`);
    queryParams.push(status);
  }

  if (search) {
    conditions.push(`(r.rfq_number ILIKE $${paramIndex} OR r.company_name ILIKE $${paramIndex} OR r.email ILIKE $${paramIndex})`);
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countRes = await query(`SELECT COUNT(*) as total FROM rfqs r ${whereClause}`, queryParams);
  const total = parseInt(countRes.rows[0].total, 10);

  const offset = (Math.max(1, page) - 1) * limit;
  queryParams.push(limit, offset);

  const listSql = `
    SELECT r.*,
           COALESCE(
             (SELECT json_agg(json_build_object('id', ri.id, 'product_id', ri.product_id, 'product_name', ri.product_name, 'sku', ri.sku, 'requested_qty', ri.requested_qty, 'unit', ri.unit, 'target_budget', ri.target_budget, 'quoted_unit_price', ri.quoted_unit_price, 'quoted_subtotal', ri.quoted_subtotal))
              FROM rfq_items ri WHERE ri.rfq_id = r.id), '[]'::json
           ) as items
    FROM rfqs r
    ${whereClause}
    ORDER BY r.created_at DESC
    LIMIT $${paramIndex++} OFFSET $${paramIndex++}
  `;

  const listRes = await query(listSql, queryParams);

  return {
    items: listRes.rows,
    pagination: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Get detailed RFQ by ID or RFQ Number
 */
async function getRfqById(id) {
  const sql = `
    SELECT r.*,
           COALESCE(
             (SELECT json_agg(json_build_object('id', ri.id, 'product_id', ri.product_id, 'product_name', ri.product_name, 'sku', ri.sku, 'requested_qty', ri.requested_qty, 'unit', ri.unit, 'target_budget', ri.target_budget, 'quoted_unit_price', ri.quoted_unit_price, 'quoted_subtotal', ri.quoted_subtotal, 'negotiation_notes', ri.negotiation_notes))
              FROM rfq_items ri WHERE ri.rfq_id = r.id), '[]'::json
           ) as items
    FROM rfqs r
    WHERE r.id = $1 OR r.rfq_number = $1
  `;
  const res = await query(sql, [id]);
  return res.rows[0] || null;
}

/**
 * Review, adjust pricing, and advance status of an RFQ
 */
async function updateRfqQuote(rfqId, updateData, adminUser = 'admin') {
  return withTransaction(async (client) => {
    const rfqRes = await client.query('SELECT * FROM rfqs WHERE id = $1 OR rfq_number = $1 FOR UPDATE', [rfqId]);
    if (rfqRes.rowCount === 0) {
      throw new Error(`RFQ '${rfqId}' not found`);
    }

    const rfq = rfqRes.rows[0];

    // Update item quoted unit prices if provided
    let calculatedSubtotal = 0;
    if (updateData.items && Array.isArray(updateData.items)) {
      for (const item of updateData.items) {
        if (item.id && item.quoted_unit_price !== undefined) {
          const unitPrice = parseFloat(item.quoted_unit_price);
          const lineSubtotal = parseFloat((unitPrice * (item.requested_qty || 1)).toFixed(2));
          calculatedSubtotal += lineSubtotal;

          await client.query(
            `UPDATE rfq_items
             SET quoted_unit_price = $1, quoted_subtotal = $2, negotiation_notes = COALESCE($3, negotiation_notes)
             WHERE id = $4 AND rfq_id = $5`,
            [unitPrice, lineSubtotal, item.negotiation_notes, item.id, rfq.id]
          );
        }
      }
    } else {
      calculatedSubtotal = parseFloat(rfq.subtotal_offered || 0);
    }

    const gstRate = updateData.gst_percentage !== undefined ? parseFloat(updateData.gst_percentage) : 18.0;
    const gstAmount = parseFloat(((calculatedSubtotal * gstRate) / 100).toFixed(2));
    const totalOffered = parseFloat((calculatedSubtotal + gstAmount).toFixed(2));

    const updateSql = `
      UPDATE rfqs SET
        status = COALESCE($1, status),
        subtotal_offered = $2,
        gst_percentage = $3,
        gst_amount = $4,
        total_offered = $5,
        terms_conditions = COALESCE($6, terms_conditions),
        notes = COALESCE($7, notes),
        assigned_sales_rep = COALESCE($8, assigned_sales_rep),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;

    const res = await client.query(updateSql, [
      updateData.status || RFQ_STATUS.QUOTED,
      calculatedSubtotal,
      gstRate,
      gstAmount,
      totalOffered,
      updateData.terms_conditions,
      updateData.notes,
      adminUser,
      rfq.id
    ]);

    return res.rows[0];
  });
}

/**
 * Generate official PDF Quotation document buffer
 */
async function generateRfqPdf(rfqId) {
  const rfq = await getRfqById(rfqId);
  if (!rfq) {
    throw new Error('RFQ not found');
  }

  const pdfData = {
    number: rfq.rfq_number,
    date: rfq.created_at,
    companyName: rfq.company_name,
    contactPerson: rfq.contact_person,
    email: rfq.email,
    phone: rfq.phone,
    ntnNumber: rfq.ntn_number,
    deliveryAddress: rfq.delivery_location,
    items: rfq.items,
    subtotal: parseFloat(rfq.subtotal_offered || 0),
    gst_percentage: parseFloat(rfq.gst_percentage || 18),
    gst_amount: parseFloat(rfq.gst_amount || 0),
    total_amount: parseFloat(rfq.total_offered || 0),
    currency: 'PKR',
    paymentTerms: 'Corporate PO / Net 30'
  };

  return generateCorporatePdf(pdfData, 'QUOTATION');
}

module.exports = {
  submitRfq,
  listRfqs,
  getRfqById,
  updateRfqQuote,
  generateRfqPdf
};
