const rfqService = require('../services/rfq.service');
const { query } = require('../config/db');

async function submitRfq(req, res, next) {
  try {
    const { companyName, contactPerson, email, phone, deliveryLocation, items } = req.body;
    if (!companyName || !contactPerson || !email || !phone || !deliveryLocation) {
      return res.status(400).json({ success: false, message: 'Company name, contact person, email, phone, and delivery location are required' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one item must be included in RFQ' });
    }
    const rfq = await rfqService.submitRfq(req.body);
    res.status(201).json({ success: true, rfq });
  } catch (error) {
    next(error);
  }
}

async function listRfqs(req, res, next) {
  try {
    const result = await rfqService.listRfqs(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

async function getRfqById(req, res, next) {
  try {
    const rfq = await rfqService.getRfqById(req.params.id);
    if (!rfq) return res.status(404).json({ success: false, message: 'RFQ not found' });
    res.json({ success: true, rfq });
  } catch (error) {
    next(error);
  }
}

async function updateRfqQuote(req, res, next) {
  try {
    const adminUser = req.user ? req.user.email : 'admin';
    const updated = await rfqService.updateRfqQuote(req.params.id, req.body, adminUser);
    res.json({ success: true, rfq: updated });
  } catch (error) {
    next(error);
  }
}

async function downloadQuotationPdf(req, res, next) {
  try {
    const pdfBuffer = await rfqService.generateRfqPdf(req.params.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="IndustrialEdge_Quotation_${req.params.id}.pdf"`);
    res.status(200).send(pdfBuffer);
  } catch (error) {
    next(error);
  }
}

// General Inquiries
async function submitInquiry(req, res, next) {
  try {
    const { name, email, message, company, phone, service } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }
    const id = `inq-${Date.now()}`;
    const sql = `
      INSERT INTO general_inquiries (id, name, email, phone, company, service, message, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'New')
      RETURNING *
    `;
    const resInq = await query(sql, [id, name, email.toLowerCase().trim(), phone || null, company || null, service || null, message]);
    res.status(201).json({ success: true, inquiry: resInq.rows[0] });
  } catch (error) {
    next(error);
  }
}

async function listInquiries(req, res, next) {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM general_inquiries';
    const params = [];
    if (status && status !== 'All') {
      params.push(status);
      sql += ' WHERE status = $1';
    }
    sql += ' ORDER BY created_at DESC';
    const resInq = await query(sql, params);
    res.json({ success: true, inquiries: resInq.rows });
  } catch (error) {
    next(error);
  }
}

async function updateInquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, reply_notes } = req.body;
    const sql = `
      UPDATE general_inquiries
      SET status = COALESCE($1, status),
          reply_notes = COALESCE($2, reply_notes),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const resInq = await query(sql, [status, reply_notes, id]);
    if (resInq.rowCount === 0) return res.status(404).json({ success: false, message: 'Inquiry not found' });
    res.json({ success: true, inquiry: resInq.rows[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitRfq,
  listRfqs,
  getRfqById,
  updateRfqQuote,
  downloadQuotationPdf,
  submitInquiry,
  listInquiries,
  updateInquiryStatus
};
