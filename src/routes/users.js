const router = require('express').Router();
const { body, param } = require('express-validator');
const ctrl = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticate, authorize('admin'));

router.get('/', ctrl.getAll);

router.get('/:id',
  param('id').isInt().withMessage('ID inválido'),
  validate,
  ctrl.getOne
);

router.put('/:id',
  [
    param('id').isInt().withMessage('ID inválido'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Nombre debe tener 2-100 caracteres'),
    body('email')
      .optional()
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    body('role')
      .optional()
      .isIn(['admin', 'customer']).withMessage('Rol inválido'),
    body('isActive')
      .optional()
      .isBoolean().withMessage('isActive debe ser booleano'),
    body('phone')
      .optional()
      .trim()
      .isMobilePhone('es-ES').withMessage('Teléfono inválido'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Dirección máxima 500 caracteres'),
  ],
  validate,
  ctrl.update
);

router.delete('/:id',
  param('id').isInt().withMessage('ID inválido'),
  validate,
  ctrl.remove
);

module.exports = router;
