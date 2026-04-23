const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const productValidation = [
  body('name').notEmpty().withMessage('Nombre requerido'),
  body('price').isFloat({ min: 0 }).withMessage('Precio inválido'),
  body('categoryId').isInt().withMessage('Categoría requerida'),
];

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', authenticate, authorize('admin'), productValidation, validate, ctrl.create);
router.put('/:id', authenticate, authorize('admin'), validate, ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
