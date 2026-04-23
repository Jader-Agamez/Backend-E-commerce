const { v4: uuidv4 } = require('uuid');

/**
 * Simulated payment gateway
 * In production, replace with Stripe/PayPal/MercadoPago SDK
 */
const processPayment = async ({ amount, cardNumber, cardHolder }) => {
  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 500));

  // Simulate decline for test card 4000000000000002
  if (cardNumber === '4000000000000002') {
    return { success: false, message: 'Tarjeta declinada' };
  }

  return {
    success: true,
    paymentId: `PAY-${uuidv4().slice(0, 8).toUpperCase()}`,
    message: 'Pago procesado exitosamente',
  };
};

module.exports = { processPayment };
