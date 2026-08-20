const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const processPayment = async ({ amount, paymentMethodId, currency = 'usd' }) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
    });

    if (paymentIntent.status === 'succeeded') {
      return { success: true, paymentId: paymentIntent.id, message: 'Pago procesado exitosamente' };
    }

    return { success: false, message: 'Pago no completado' };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

module.exports = { processPayment };
