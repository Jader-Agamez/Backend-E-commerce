const router = require('express').Router();
const { body, param, query } = require('express-validator');
const ctrl = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const productValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nombre requerido')
    .isLength({ max: 200 }).withMessage('Nombre máximo 200 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Descripción máxima 2000 caracteres'),
  body('price')
    .isFloat({ min: 0.01 }).withMessage('Precio debe ser mayor a 0'),
  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock debe ser un número entero positivo'),
  body('sku')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('SKU máximo 50 caracteres'),
  body('categoryId')
    .isInt().withMessage('Categoría requerida'),
  body('image')
    .optional()
    .trim()
    .isURL().withMessage('URL de imagen inválida'),
];

const queryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Página debe ser un número positivo'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Límite debe ser 1-100'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Precio mínimo inválido'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Precio máximo inválido'),
];

router.get('/', queryValidation, validate, ctrl.getAll);
router.get('/:id',
  param('id').isInt().withMessage('ID inválido'),
  validate,
  ctrl.getOne
);
router.post('/', authenticate, authorize('admin'), productValidation, validate, ctrl.create);
router.put('/:id',
  authenticate,
  authorize('admin'),
  param('id').isInt().withMessage('ID inválido'),
  productValidation,
  validate,
  ctrl.update
);
router.delete('/:id',
  authenticate,
  authorize('admin'),
  param('id').isInt().withMessage('ID inválido'),
  validate,
  ctrl.remove
);

module.exports = router;
