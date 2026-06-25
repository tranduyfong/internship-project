const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const cartRoutes = require('./cart.routes');
const addressRoutes = require('./address.routes');
const receiptRoutes = require('./receipt.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/addresses', addressRoutes);
router.use('/receipts', receiptRoutes);

module.exports = router;