const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.post('/', ctrl.createOrder);
router.get('/my', ctrl.getMyOrders);
router.get('/:id', ctrl.getOne);

// Admin
router.get('/', authorize('admin'), ctrl.getAllOrders);
router.put('/:id/status', authorize('admin'), ctrl.updateStatus);

module.exports = router;
