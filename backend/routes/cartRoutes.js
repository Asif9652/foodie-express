const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/add', protect, cartController.addToCart);
router.get('/', protect, cartController.getCartItems);
router.delete('/remove/:itemId', protect, cartController.removeFromCart);

module.exports = router;
