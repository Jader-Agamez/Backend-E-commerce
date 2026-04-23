const router = require('express').Router();
const ctrl = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', ctrl.getCart);
router.post('/', ctrl.addItem);
router.put('/:id', ctrl.updateItem);
// /clear MUST be before /:id so Express doesn't treat "clear" as an id
router.delete('/clear', ctrl.clearCart);
router.delete('/:id', ctrl.removeItem);

module.exports = router;
