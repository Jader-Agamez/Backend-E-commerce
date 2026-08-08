const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 */
router.post('/register',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Nombre requerido')
      .isLength({ min: 2, max: 100 }).withMessage('Nombre debe tener 2-100 caracteres'),
    body('email')
      .trim()
      .isEmail().withMessage('Email inválido')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 }).withMessage('Contraseña mínimo 6 caracteres')
      .matches(/\d/).withMessage('Contraseña debe contener al menos un número')
      .matches(/[a-zA-Z]/).withMessage('Contraseña debe contener al menos una letra'),
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
  ctrl.register
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 */
router.post('/login',
  [
    body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').notEmpty().withMessage('Contraseña requerida'),
  ],
  validate,
  ctrl.login
);

router.get('/profile', authenticate, ctrl.getProfile);
router.put('/profile', authenticate,
  [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Nombre debe tener 2-100 caracteres'),
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
  ctrl.updateProfile
);

module.exports = router;
