const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/:restaurantId', menuController.getMenuByRestaurant);

module.exports = router;
