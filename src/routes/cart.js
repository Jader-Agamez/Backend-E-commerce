const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticate);

router.get('/', ctrl.getCart);

router.post('/',
  [
    body('productId')
      .isInt().withMessage('ID de producto inválido'),
    body('quantity')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Cantidad debe ser 1-100'),
  ],
  validate,
  ctrl.addItem
);

router.put('/:id',
  [
    param('id').isInt().withMessage('ID inválido'),
    body('quantity')
      .isInt({ min: 1, max: 100 }).withMessage('Cantidad debe ser 1-100'),
  ],
  validate,
  ctrl.updateItem
);

// /clear MUST be before /:id so Express doesn't treat "clear" as an id
router.delete('/clear', ctrl.clearCart);

router.delete('/:id',
  param('id').isInt().withMessage('ID inválido'),
  validate,
  ctrl.removeItem
);

module.exports = router;
