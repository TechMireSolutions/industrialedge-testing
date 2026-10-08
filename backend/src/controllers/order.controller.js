const orderService = require('../services/order.service');
const { generateCorporatePdf } = require('../utils/pdfGenerator');

async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

async function trackOrder(req, res, next) {
  try {
    const { orderNumber } = req.params;
    const order = await orderService.trackOrderByNumber(orderNumber);
    if (!order) {
      return res.status(404).json({ success: false, message: `No active order found with tracking number '${orderNumber}'` });
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

async function listOrders(req, res, next) {
  try {
    const result = await orderService.listOrders(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, notes, trackingCarrier, trackingCode } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    const adminUser = req.user ? req.user.email : 'admin';
    const updated = await orderService.updateOrderStatus(id, status, adminUser, {
      notes,
      trackingCarrier,
      trackingCode
    });
    res.json({ success: true, order: updated });
  } catch (error) {
    next(error);
  }
}

async function downloadInvoicePdf(req, res, next) {
  try {
    const { id } = req.params;
    const order = await orderService.trackOrderByNumber(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const pdfData = {
      number: order.order_number,
      date: order.created_at,
      companyName: order.company_name,
      contactPerson: order.contact_person,
      email: order.email,
      phone: order.phone,
      ntnNumber: order.ntn_number,
      deliveryAddress: order.delivery_address,
      items: order.items,
      subtotal: parseFloat(order.subtotal),
      gst_percentage: parseFloat(order.gst_percentage || 18),
      gst_amount: parseFloat(order.gst_amount),
      shipping_fee: parseFloat(order.shipping_fee || 0),
      total_amount: parseFloat(order.total_amount),
      currency: order.currency_code || 'PKR',
      paymentTerms: order.payment_method || 'Corporate Invoice / PO'
    };

    const pdfBuffer = await generateCorporatePdf(pdfData, 'INVOICE');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="IndustrialEdge_Invoice_${order.order_number}.pdf"`);
    res.status(200).send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  trackOrder,
  listOrders,
  updateStatus,
  downloadInvoicePdf
};
