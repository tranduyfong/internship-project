const express = require('express');
const analyticsController = require('../controllers/analytics.controllers');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Tất cả các route trong nhánh này đều phải qua 2 lớp cửa: Đăng nhập và Có quyền Admin
router.use(verifyToken, verifyAdmin);

router.get('/revenue', analyticsController.getRevenue);
router.get('/products', analyticsController.getProductSales);
router.get('/customers', analyticsController.getTopCustomers);
router.get('/order-status', analyticsController.getOrderStatus);
router.get('/profit', analyticsController.getProfit);
router.get('/compare-brands', analyticsController.getCompareBrands);
router.get('/overview-stats', analyticsController.getInventoryAndSales);

module.exports = router;