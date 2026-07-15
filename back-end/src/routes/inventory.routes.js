const express = require('express');
const inventoryController = require('../controllers/inventory.controllers');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(verifyToken, verifyAdmin); // Chỉ cho phép Admin

router.post('/add', inventoryController.addStockLog); // API nhập hàng / hoàn trả
router.get('/status', inventoryController.getStockReport); // Thống kê tồn kho
router.get('/history', inventoryController.getHistory); // Lịch sử nhập/hoàn hàng

module.exports = router;