const { query } = require('../config/db');

/**
 * List customer accounts with total spend, order count, and search
 */
async function listCustomers(params = {}) {
  const { search, page = 1, limit = 20 } = params;
  const conditions = [];
  const queryParams = [];
  let paramIndex = 1;

  if (search) {
    conditions.push(`(c.full_name ILIKE $${paramIndex} OR c.company_name ILIKE $${paramIndex} OR c.email ILIKE $${paramIndex} OR c.phone ILIKE $${paramIndex} OR c.ntn_number ILIKE $${paramIndex})`);
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countRes = await query(`SELECT COUNT(*) as total FROM customers c ${whereClause}`, queryParams);
  const total = parseInt(countRes.rows[0].total, 10);

  const offset = (Math.max(1, page) - 1) * limit;
  queryParams.push(limit, offset);

  const listSql = `
    SELECT c.*,
           (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) as live_orders_count,
           (SELECT COALESCE(SUM(o.total_amount), 0) FROM orders o WHERE o.customer_id = c.id AND o.status != 'Cancelled') as live_total_spend,
           (SELECT COUNT(*) FROM rfqs r WHERE r.customer_id = c.id) as rfqs_count
    FROM customers c
    ${whereClause}
    ORDER BY c.created_at DESC
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
 * Deep inspection of single customer with full order history & RFQ history
 */
async function getCustomerDetails(customerId) {
  const custRes = await query('SELECT * FROM customers WHERE id = $1', [customerId]);
  if (custRes.rowCount === 0) {
    return null;
  }
  const customer = custRes.rows[0];

  // Fetch purchase history
  const ordersRes = await query(
    `SELECT o.id, o.order_number, o.created_at, o.status, o.total_amount, o.subtotal, o.shipping_fee, o.payment_method,
            COALESCE(
              (SELECT json_agg(json_build_object('name', oi.product_name, 'sku', oi.sku, 'quantity', oi.quantity, 'price', oi.price, 'subtotal', oi.subtotal))
               FROM order_items oi WHERE oi.order_id = o.id), '[]'::json
            ) as items
     FROM orders o
     WHERE o.customer_id = $1 OR LOWER(o.email) = LOWER($2)
     ORDER BY o.created_at DESC`,
    [customerId, customer.email]
  );

  // Fetch RFQs history
  const rfqsRes = await query(
    `SELECT r.id, r.rfq_number, r.status, r.total_offered, r.subtotal_offered, r.required_by_date, r.created_at,
            COALESCE(
              (SELECT json_agg(json_build_object('name', ri.product_name, 'requested_qty', ri.requested_qty, 'quoted_unit_price', ri.quoted_unit_price, 'quoted_subtotal', ri.quoted_subtotal))
               FROM rfq_items ri WHERE ri.rfq_id = r.id), '[]'::json
            ) as items
     FROM rfqs r
     WHERE r.customer_id = $1 OR LOWER(r.email) = LOWER($2)
     ORDER BY r.created_at DESC`,
    [customerId, customer.email]
  );

  // Fetch General Inquiries
  const inqRes = await query(
    `SELECT * FROM general_inquiries WHERE LOWER(email) = LOWER($1) ORDER BY created_at DESC`,
    [customer.email]
  );

  return {
    ...customer,
    purchaseHistory: ordersRes.rows,
    rfqHistory: rfqsRes.rows,
    inquiryHistory: inqRes.rows
  };
}

module.exports = {
  listCustomers,
  getCustomerDetails
};
