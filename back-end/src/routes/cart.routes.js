const express = require('express');
const cartController = require('../controllers/cart.controllers');
const { verifyToken } = require('../middlewares/auth.middleware');

const router = express.Router();

// Tất cả các route giỏ hàng đều yêu cầu đăng nhập
router.use(verifyToken);

router.get('/', cartController.getList);           // Xem giỏ hàng
router.post('/', cartController.add);              // Thêm vào giỏ
router.put('/:id', cartController.updateQuantity); // Sửa số lượng (id ở đây là cart_id)
router.delete('/:id', cartController.remove);      // Xóa khỏi giỏ (id ở đây là cart_id)

module.exports = router;