const router = require('express').Router();
const { body, param, query } = require('express-validator');
const ctrl = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const orderValidation = [
  body('shippingAddress')
    .trim()
    .notEmpty().withMessage('Dirección de envío requerida')
    .isLength({ min: 5, max: 500 }).withMessage('Dirección debe tener 5-500 caracteres'),
  body('paymentMethod')
    .optional()
    .isIn(['card', 'paypal', 'transfer']).withMessage('Método de pago inválido'),
  body('cardNumber')
    .if(body('paymentMethod').equals('card'))
    .isLength({ min: 13, max: 19 }).withMessage('Número de tarjeta inválido')
    .matches(/^[0-9]+$/).withMessage('Número de tarjeta solo debe contener números'),
  body('cardHolder')
    .if(body('paymentMethod').equals('card'))
    .trim()
    .notEmpty().withMessage('Nombre del titular requerido'),
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
