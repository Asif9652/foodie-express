const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/create', protect, orderController.createOrder);
router.post('/verify-payment', protect, orderController.verifyPayment);
router.get('/user', protect, orderController.getUserOrders);
router.get('/:id', protect, orderController.getOrderById);

module.exports = router;
