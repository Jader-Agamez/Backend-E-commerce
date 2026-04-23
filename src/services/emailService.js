const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendOrderConfirmation = async (order, user) => {
  const itemsHtml = order.items
    .map((i) => `<tr><td>${i.product.name}</td><td>${i.quantity}</td><td>$${i.unitPrice}</td><td>$${i.subtotal}</td></tr>`)
    .join('');

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: `Confirmación de pedido #${order.id}`,
    html: `
      <h2>¡Gracias por tu compra, ${user.name}!</h2>
      <p>Tu pedido <strong>#${order.id}</strong> ha sido confirmado.</p>
      <table border="1" cellpadding="8" style="border-collapse:collapse;width:100%">
        <thead><tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Subtotal</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <h3>Total: $${order.total}</h3>
      <p>Dirección de envío: ${order.shippingAddress}</p>
    `,
  });
};

const sendWelcomeEmail = async (user) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: '¡Bienvenido a E-Commerce!',
    html: `<h2>Hola ${user.name}, bienvenido a nuestra tienda.</h2><p>Ya puedes comenzar a comprar.</p>`,
  });
};

module.exports = { sendOrderConfirmation, sendWelcomeEmail };
