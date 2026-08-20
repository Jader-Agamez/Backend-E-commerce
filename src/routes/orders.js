const router = require('express').Router();
const { body, param, query } = require('express-validator');
const ctrl = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const orderValidation = [
  body('shippingAddress')
    .trim()
    .notEmpty().withMessage('Dirección de envío requerida')
    .isLength({ min: 5, max: 500 }).withMessage('Dirección debe tener 5-500 caracteres'),
  body('paymentMethod')
    .optional()
    .isIn(['card', 'paypal', 'transfer']).withMessage('Método de pago inválido'),
  body('paymentMethodId')
    .notEmpty().withMessage('Método de pago requerido'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Notas máxima 500 caracteres'),
];

const statusValidation = [
  body('status')
    .isIn(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Estado inválido'),
];

router.use(authenticate);

router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', orderValidation, validate, ctrl.createOrder);
router.get('/my', ctrl.getMyOrders);
router.get('/:id',
  param('id').isInt().withMessage('ID inválido'),
  validate,
  ctrl.getOne
);

// Admin
router.get('/',
  authorize('admin'),
  query('page').optional().isInt({ min: 1 }).withMessage('Página inválida'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite inválido'),
  validate,
  ctrl.getAllOrders
);
router.put('/:id/status',
  authorize('admin'),
  param('id').isInt().withMessage('ID inválido'),
  statusValidation,
  validate,
  ctrl.updateStatus
);

module.exports = router;
