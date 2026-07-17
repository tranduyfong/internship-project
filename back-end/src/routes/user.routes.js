const express = require('express');
const userController = require('../controllers/user.controllers');
const { verifyToken, verifyAdmin, verifyAdminOrStaff } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/me', verifyToken, userController.getMe);
router.put('/me', verifyToken, userController.updateMe);
router.post('/me/addresses', verifyToken, userController.addAddress);
router.put('/me/addresses/:addressId/default', verifyToken, userController.setDefaultAddress);
router.put('/me/addresses/:addressId', verifyToken, userController.updateAddress); // Sửa địa chỉ
router.delete('/me/addresses/:addressId', verifyToken, userController.deleteAddress); // Xóa địa chỉ
router.put('/me/password', verifyToken, userController.changePassword);

router.get('/search', verifyToken, verifyAdmin, userController.search);
router.put('/admin/:id', verifyToken, verifyAdmin, userController.updateAccountByAdmin);
router.patch('/admin/:id/status', verifyToken, verifyAdmin, userController.changeStatus);
router.get('/admin/permissions', verifyToken, verifyAdminOrStaff, userController.listAllPermissions);
router.get('/admin/:id/permissions', verifyToken, verifyAdminOrStaff, userController.getStaffPermissions);
router.put('/admin/:id/permissions', verifyToken, verifyAdmin, userController.assignPermissions);
router.get('/:id', verifyToken, verifyAdmin, userController.getDetail);

router.get('/me/permissions', verifyToken, userController.getMyPermissions);

module.exports = router;