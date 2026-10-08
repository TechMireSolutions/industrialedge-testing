const { query, withTransaction } = require('../config/db');
const { ORDER_STATUS } = require('../config/constants');
const { adjustStock } = require('./inventory.service');
const { notifyOrderDispatched, notifyOrderPlaced } = require('./notification.service');
const logger = require('../utils/logger');

/**
 * Generate a random 6-digit order number prefixed with IE-
 */
async function generateOrderNumber() {
  let isUnique = false;
  let orderNumber = '';

  while (!isUnique) {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    orderNumber = `IE-${randomDigits}`;

    const res = await query('SELECT id FROM orders WHERE order_number = $1', [orderNumber]);
    if (res.rowCount === 0) {
      isUnique = true;
    }
  }

  return orderNumber;
}

/**
 * Create a new customer order with transaction and inventory deduction
 */
async function createOrder(data) {
  return withTransaction(async (client) => {
    const orderNumber = await generateOrderNumber();
    const orderId = `ord-${Date.now()}`;

    // Upsert customer record
    let customerId = null;
    if (data.email) {
      const custRes = await client.query(
        `INSERT INTO customers (email, full_name, company_name, phone, ntn_number, billing_address, shipping_address, city, total_orders, total_spend)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1, $9)
         ON CONFLICT (email) DO UPDATE SET
           full_name = EXCLUDED.full_name,
           company_name = COALESCE(EXCLUDED.company_name, customers.company_name),
           phone = COALESCE(EXCLUDED.phone, customers.phone),
           ntn_number = COALESCE(EXCLUDED.ntn_number, customers.ntn_number),
           shipping_address = EXCLUDED.shipping_address,
           city = EXCLUDED.city,
           total_orders = customers.total_orders + 1,
           total_spend = customers.total_spend + EXCLUDED.total_spend
         RETURNING id`,
        [
          data.email.toLowerCase().trim(),
          data.contactPerson || data.fullName,
          data.companyName || null,
          data.phone,
          data.ntnNumber || null,
          data.deliveryAddress,
          data.deliveryAddress,
          data.city || 'Karachi',
          data.totalAmount || 0
        ]
      );
      customerId = custRes.rows[0].id;
    }

    // Insert order record
    const insertOrderSql = `
      INSERT INTO orders (
        id, order_number, customer_id, company_name, contact_person, email, phone,
        ntn_number, delivery_address, city, shipping_region_id, shipping_fee,
        payment_method, po_number, notes, subtotal, gst_percentage, gst_amount,
        total_amount, currency_code, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19, $20, $21
      ) RETURNING *
    `;

    const orderParams = [
      orderId,
      orderNumber,
      customerId,
      data.companyName || null,
      data.contactPerson || data.fullName,
      data.email.toLowerCase().trim(),
      data.phone,
      data.ntnNumber || null,
      data.deliveryAddress,
      data.city || 'Karachi',
      data.shippingRegionId || null,
      data.shippingFee || 0.00,
      data.paymentMethod || 'Corporate Invoice / PO',
      data.poNumber || null,
      data.notes || null,
      data.subtotal,
      data.gstPercentage || 18.00,
      data.gstAmount,
      data.totalAmount,
      data.currencyCode || 'PKR',
      ORDER_STATUS.PENDING
    ];

    const orderRes = await client.query(insertOrderSql, orderParams);
    const createdOrder = orderRes.rows[0];

    // Insert items & deduct inventory
    for (const item of data.items || []) {
      const itemSubtotal = parseFloat((item.price * item.quantity).toFixed(2));
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, sku, unit, price, quantity, subtotal, image_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          orderId,
          item.productId || null,
          item.name || item.product_name,
          item.sku || null,
          item.unit || 'Piece',
          item.price,
          item.quantity,
          itemSubtotal,
          item.image || item.image_url || null
        ]
      );

      // Deduct inventory if product_id is associated
      if (item.productId) {
        await client.query(
          `UPDATE products
           SET stock_quantity = GREATEST(0, stock_quantity - $1),
               in_stock = (stock_quantity - $1 > 0)
           WHERE id = $2`,
          [item.quantity, item.productId]
        );

        await client.query(
          `INSERT INTO inventory_logs (product_id, change_type, quantity_changed, previous_quantity, new_quantity, reference_id, notes, performed_by)
           SELECT id, 'sale', -$1, stock_quantity + $1, stock_quantity, $2, 'Order checkout deduction', 'checkout'
           FROM products WHERE id = $3`,
          [item.quantity, orderNumber, item.productId]
        );
      }
    }

    // Status audit log
    await client.query(
      `INSERT INTO order_status_history (order_id, status, notes, changed_by_admin)
       VALUES ($1, $2, 'Order received and registered into processing pipeline', 'customer_portal')`,
      [orderId, ORDER_STATUS.PENDING]
    );

    // Trigger order confirmation notification asynchronously
    notifyOrderPlaced(createdOrder).catch((err) => logger.error('Order placed email notification failed', { error: err.message }));

    return createdOrder;
  });
}

/**
 * Public live tracking by order number
 */
async function trackOrderByNumber(orderNumber) {
  const orderRes = await query(
    `SELECT o.id, o.order_number, o.company_name, o.contact_person, o.email, o.phone,
            o.delivery_address, o.city, o.shipping_fee, o.subtotal, o.gst_amount, o.total_amount,
            o.status, o.tracking_carrier, o.tracking_code, o.dispatched_at, o.delivered_at, o.created_at,
            COALESCE(
              (SELECT json_agg(json_build_object('name', oi.product_name, 'sku', oi.sku, 'quantity', oi.quantity, 'unit', oi.unit, 'price', oi.price, 'subtotal', oi.subtotal, 'image', oi.image_url))
               FROM order_items oi WHERE oi.order_id = o.id), '[]'::json
            ) as items,
            COALESCE(
              (SELECT json_agg(json_build_object('status', osh.status, 'notes', osh.notes, 'timestamp', osh.created_at) ORDER BY osh.created_at ASC)
               FROM order_status_history osh WHERE osh.order_id = o.id), '[]'::json
            ) as timeline
     FROM orders o
     WHERE o.order_number = $1 OR o.id = $1`,
    [orderNumber.trim()]
  );

  return orderRes.rows[0] || null;
}

/**
 * List orders with filtering and pagination for Admin Dashboard
 */
async function listOrders(params = {}) {
  const { status, search, page = 1, limit = 20 } = params;
  const conditions = [];
  const queryParams = [];
  let paramIndex = 1;

  if (status && status !== 'All') {
    conditions.push(`o.status = $${paramIndex++}`);
    queryParams.push(status);
  }

  if (search) {
    conditions.push(`(o.order_number ILIKE $${paramIndex} OR o.email ILIKE $${paramIndex} OR o.company_name ILIKE $${paramIndex} OR o.contact_person ILIKE $${paramIndex})`);
    queryParams.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countRes = await query(`SELECT COUNT(*) as total FROM orders o ${whereClause}`, queryParams);
  const total = parseInt(countRes.rows[0].total, 10);

  const offset = (Math.max(1, page) - 1) * limit;
  queryParams.push(limit, offset);

  const listSql = `
    SELECT o.*,
           COALESCE(
             (SELECT json_agg(json_build_object('product_name', oi.product_name, 'sku', oi.sku, 'quantity', oi.quantity, 'unit', oi.unit, 'price', oi.price, 'subtotal', oi.subtotal, 'image_url', oi.image_url))
              FROM order_items oi WHERE oi.order_id = o.id), '[]'::json
           ) as items
    FROM orders o
    ${whereClause}
    ORDER BY o.created_at DESC
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
 * Update order status manually by Admin with dispatch notification triggers
 */
async function updateOrderStatus(orderId, newStatus, adminUser = 'admin', options = {}) {
  const { notes = '', trackingCarrier, trackingCode } = options;

  return withTransaction(async (client) => {
    const orderRes = await client.query('SELECT * FROM orders WHERE id = $1 OR order_number = $1 FOR UPDATE', [orderId]);
    if (orderRes.rowCount === 0) {
      throw new Error(`Order '${orderId}' not found`);
    }

    const order = orderRes.rows[0];
    const previousStatus = order.status;

    let dispatchedAt = order.dispatched_at;
    let deliveredAt = order.delivered_at;

    if (newStatus === ORDER_STATUS.DISPATCHED && !dispatchedAt) {
      dispatchedAt = new Date().toISOString();
    }
    if (newStatus === ORDER_STATUS.DELIVERED && !deliveredAt) {
      deliveredAt = new Date().toISOString();
    }

    // If order is cancelled, restore stock
    if (newStatus === ORDER_STATUS.CANCELLED && previousStatus !== ORDER_STATUS.CANCELLED) {
      const itemsRes = await client.query('SELECT product_id, quantity FROM order_items WHERE order_id = $1', [order.id]);
      for (const item of itemsRes.rows) {
        if (item.product_id) {
          await client.query(
            `UPDATE products SET stock_quantity = stock_quantity + $1, in_stock = TRUE WHERE id = $2`,
            [item.quantity, item.product_id]
          );
          await client.query(
            `INSERT INTO inventory_logs (product_id, change_type, quantity_changed, previous_quantity, new_quantity, reference_id, notes, performed_by)
             SELECT id, 'return', $1, stock_quantity - $1, stock_quantity, $2, 'Order cancellation restocking', $3
             FROM products WHERE id = $4`,
            [item.quantity, order.order_number, adminUser, item.product_id]
          );
        }
      }
    }

    const updateSql = `
      UPDATE orders SET
        status = $1,
        tracking_carrier = COALESCE($2, tracking_carrier),
        tracking_code = COALESCE($3, tracking_code),
        dispatched_at = $4,
        delivered_at = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

    const res = await client.query(updateSql, [newStatus, trackingCarrier, trackingCode, dispatchedAt, deliveredAt, order.id]);
    const updatedOrder = res.rows[0];

    // Log status history
    await client.query(
      `INSERT INTO order_status_history (order_id, status, notes, changed_by_admin, notified_customer)
       VALUES ($1, $2, $3, $4, $5)`,
      [order.id, newStatus, notes || `Status changed from ${previousStatus} to ${newStatus}`, adminUser, true]
    );

    // If status changed to Dispatched, trigger dispatch notification
    if (newStatus === ORDER_STATUS.DISPATCHED) {
      notifyOrderDispatched(updatedOrder).catch((err) => logger.error('Dispatch notification failed', { error: err.message }));
    }

    return updatedOrder;
  });
}

module.exports = {
  createOrder,
  trackOrderByNumber,
  listOrders,
  updateOrderStatus
};
