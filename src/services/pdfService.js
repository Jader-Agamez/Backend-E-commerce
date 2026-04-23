const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = (order, user) => {
  return new Promise((resolve, reject) => {
    const invoicesDir = path.join(__dirname, '../../invoices');
    if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true });

    const filePath = path.join(invoicesDir, `invoice-${order.id}.pdf`);
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Header
    doc.fontSize(24).text('FACTURA', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Pedido #${order.id}`, { align: 'right' });
    doc.text(`Fecha: ${new Date(order.createdAt).toLocaleDateString('es-ES')}`, { align: 'right' });
    doc.moveDown();

    // Customer
    doc.fontSize(14).text('Cliente:');
    doc.fontSize(12).text(`Nombre: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Dirección: ${order.shippingAddress}`);
    doc.moveDown();

    // Items table header
    doc.fontSize(14).text('Productos:');
    doc.moveDown(0.5);
    const tableTop = doc.y;
    doc.fontSize(11);
    doc.text('Producto', 50, tableTop, { width: 200 });
    doc.text('Cant.', 260, tableTop, { width: 60 });
    doc.text('Precio', 330, tableTop, { width: 80 });
    doc.text('Subtotal', 420, tableTop, { width: 100 });
    doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    doc.moveDown();

    // Items
    order.items.forEach((item) => {
      const y = doc.y;
      doc.text(item.product.name, 50, y, { width: 200 });
      doc.text(String(item.quantity), 260, y, { width: 60 });
      doc.text(`$${item.unitPrice}`, 330, y, { width: 80 });
      doc.text(`$${item.subtotal}`, 420, y, { width: 100 });
      doc.moveDown();
    });

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    doc.fontSize(14).text(`TOTAL: $${order.total}`, { align: 'right' });

    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
};

module.exports = { generateInvoice };
