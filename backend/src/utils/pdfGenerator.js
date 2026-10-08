const PDFDocument = require('pdfkit');

/**
 * Generate official corporate PDF Quotation or Invoice
 *
 * @param {Object} data
 * @param {'QUOTATION'|'INVOICE'} type
 * @returns {Promise<Buffer>}
 */
function generateCorporatePdf(data, type = 'QUOTATION') {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
      info: {
        Title: `${type === 'QUOTATION' ? 'Quotation' : 'Invoice'} - ${data.number}`,
        Author: 'Industrial Edge Pakistan',
        Subject: 'Industrial Procurement Document'
      }
    });

    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', (err) => reject(err));

    // Colors
    const primaryColor = '#0F172A'; // Slate 900
    const accentColor = '#D97706';  // Industrial Amber 600
    const lightGray = '#F1F5F9';
    const darkGray = '#334155';

    // Header Branding
    doc.rect(40, 40, 515, 60).fill(primaryColor);
    doc.fillColor('#FFFFFF')
      .fontSize(18)
      .font('Helvetica-Bold')
      .text('INDUSTRIAL EDGE', 55, 52)
      .fontSize(9)
      .font('Helvetica')
      .text('Total Corporate & Industrial Procurement Solutions', 55, 75);

    doc.fillColor(accentColor)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(type === 'QUOTATION' ? 'OFFICIAL QUOTATION' : 'COMMERCIAL TAX INVOICE', 350, 55, { align: 'right' })
      .fillColor('#94A3B8')
      .fontSize(8)
      .font('Helvetica')
      .text('NTN: 8291044-3 | STRN: 327787618291', 350, 75, { align: 'right' });

    // Document Meta
    doc.moveDown(2);
    const metaY = 120;

    // Left Box: Supplier & Client Info
    doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold').text('ISSUED TO / CLIENT:', 40, metaY);
    doc.fillColor(darkGray).fontSize(9).font('Helvetica')
      .text(`Company: ${data.companyName || 'N/A'}`)
      .text(`Contact: ${data.contactPerson || 'Procurement Officer'}`)
      .text(`Email: ${data.email || 'N/A'}`)
      .text(`Phone: ${data.phone || 'N/A'}`)
      .text(`NTN/Tax ID: ${data.ntnNumber || 'Standard Corporate'}`)
      .text(`Delivery Location: ${data.deliveryAddress || data.deliveryLocation || 'Karachi, Pakistan'}`);

    // Right Box: Reference Info
    doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold').text('REFERENCE DETAILS:', 340, metaY);
    doc.fillColor(darkGray).fontSize(9).font('Helvetica')
      .text(`Ref Number: ${data.number}`, 340)
      .text(`Date Issued: ${new Date(data.date || Date.now()).toLocaleDateString()}`, 340)
      .text(`Valid Until: ${data.validUntil || '15 Days from issuance'}`, 340)
      .text(`Payment Terms: ${data.paymentTerms || 'Corporate PO / 30 Days Net'}`, 340)
      .text(`Currency: ${data.currency || 'PKR'}`, 340);

    // Items Table Header
    const tableTop = 230;
    doc.rect(40, tableTop, 515, 22).fill(lightGray);

    doc.fillColor(primaryColor).fontSize(8).font('Helvetica-Bold');
    doc.text('#', 45, tableTop + 6, { width: 20 });
    doc.text('ITEM DESCRIPTION', 70, tableTop + 6, { width: 220 });
    doc.text('SKU', 295, tableTop + 6, { width: 60 });
    doc.text('QTY', 360, tableTop + 6, { width: 35, align: 'center' });
    doc.text('RATE (PKR)', 400, tableTop + 6, { width: 70, align: 'right' });
    doc.text('TOTAL (PKR)', 475, tableTop + 6, { width: 75, align: 'right' });

    // Table Lines
    let currentY = tableTop + 25;
    const items = data.items || [];

    doc.font('Helvetica').fontSize(8).fillColor(darkGray);

    items.forEach((item, index) => {
      const lineTotal = (item.quoted_unit_price || item.price || 0) * (item.requested_qty || item.quantity || 1);
      const name = item.product_name || item.name || 'Industrial Item';
      const sku = item.sku || 'N/A';
      const qty = `${item.requested_qty || item.quantity || 1} ${item.unit || 'Unit'}`;
      const rate = (item.quoted_unit_price || item.price || 0).toLocaleString();

      doc.text(`${index + 1}`, 45, currentY, { width: 20 });
      doc.text(name, 70, currentY, { width: 220 });
      doc.text(sku, 295, currentY, { width: 60 });
      doc.text(qty, 360, currentY, { width: 35, align: 'center' });
      doc.text(rate, 400, currentY, { width: 70, align: 'right' });
      doc.text(lineTotal.toLocaleString(), 475, currentY, { width: 75, align: 'right' });

      currentY += 18;
      // Border
      doc.strokeColor('#E2E8F0').lineWidth(0.5).moveTo(40, currentY - 2).lineTo(555, currentY - 2).stroke();
    });

    // Summary Box
    currentY += 15;
    const subtotal = data.subtotal || data.subtotal_offered || 0;
    const gstRate = data.gst_percentage || 18.0;
    const gstAmount = data.gst_amount || (subtotal * gstRate) / 100;
    const shippingFee = data.shipping_fee || 0;
    const grandTotal = data.total_amount || data.total_offered || (subtotal + gstAmount + shippingFee);

    const summaryX = 350;
    doc.font('Helvetica').fontSize(9).fillColor(darkGray);
    doc.text('Subtotal:', summaryX, currentY);
    doc.text(`PKR ${subtotal.toLocaleString()}`, 440, currentY, { align: 'right', width: 110 });

    currentY += 16;
    doc.text(`Sales Tax / GST (${gstRate}%):`, summaryX, currentY);
    doc.text(`PKR ${gstAmount.toLocaleString()}`, 440, currentY, { align: 'right', width: 110 });

    if (shippingFee > 0) {
      currentY += 16;
      doc.text('Logistics & Delivery:', summaryX, currentY);
      doc.text(`PKR ${shippingFee.toLocaleString()}`, 440, currentY, { align: 'right', width: 110 });
    }

    currentY += 18;
    doc.rect(summaryX - 5, currentY - 4, 210, 24).fill(lightGray);
    doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(10);
    doc.text('GRAND TOTAL:', summaryX, currentY + 3);
    doc.text(`PKR ${grandTotal.toLocaleString()}`, 440, currentY + 3, { align: 'right', width: 110 });

    // Terms & Bank Details Footer
    const footerY = 680;
    doc.rect(40, footerY, 515, 80).fill('#F8FAFC');
    doc.fillColor(primaryColor).fontSize(8).font('Helvetica-Bold').text('TERMS & CONDITIONS & BANK DETAILS', 50, footerY + 8);
    doc.fillColor(darkGray).fontSize(7).font('Helvetica')
      .text('1. All prices are inclusive of standard corporate packaging and subject to stock availability.', 50, footerY + 22)
      .text('2. Payments should be made directly to: Bank Alfalah Limited | A/C Title: Industrial Edge PK | IBAN: PK36ALFH00280198273618', 50, footerY + 32)
      .text('3. This document is computer generated and valid with digital corporate seal for 15 calendar days.', 50, footerY + 42)
      .text('Inquiries & Dispatch: support@industrialedge.pk | +92 332 2316225 | Suite M-107 Odeon Center Saddar Karachi', 50, footerY + 54);

    doc.end();
  });
}

module.exports = {
  generateCorporatePdf
};
