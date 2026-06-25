const express = require('express');
const receiptController = require('../controllers/receipt.controllers');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Lấy danh sách hóa đơn cá nhân
router.get('/me', verifyToken, receiptController.getMyReceipts);
router.post('/checkout', verifyToken, receiptController.checkout);
router.post('/:id/repay', verifyToken, receiptController.repay);
router.get('/vnpay-ipn', receiptController.vnpayIpn);
router.get('/vnpay-return', receiptController.vnpayReturn);

module.exports = router;