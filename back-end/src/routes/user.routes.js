const express = require('express');
const userController = require('../controllers/user.controllers');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/me', verifyToken, userController.getMe);
router.put('/me', verifyToken, userController.updateMe);
router.post('/me/addresses', verifyToken, userController.addAddress);
router.put('/me/addresses/:addressId/default', verifyToken, userController.setDefaultAddress);
router.put('/me/addresses/:addressId', verifyToken, userController.updateAddress); // Sửa địa chỉ
router.delete('/me/addresses/:addressId', verifyToken, userController.deleteAddress); // Xóa địa chỉ

router.get('/search', verifyToken, verifyAdmin, userController.search);

router.get('/:id', verifyToken, verifyAdmin, userController.getDetail);

module.exports = router;