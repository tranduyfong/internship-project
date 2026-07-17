const express = require('express');
const productController = require('../controllers/product.controllers');
const { verifyToken, verifyAdminOrStaff } = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');
const { requirePermission } = require('../middlewares/permission.middleware');

const router = express.Router();

router.get('/search', productController.getList);
router.get('/:id', productController.getDetail);
router.post('/', verifyToken, requirePermission('ADD_PRODUCT'), uploadMiddleware, productController.create);
router.put('/:id', verifyToken, requirePermission('EDIT_PRODUCT'), uploadMiddleware, productController.editProduct);
router.patch('/:id/status', verifyToken, requirePermission('DELETE_PRODUCT'), productController.changeStatus);
router.get('/admin/search', verifyToken, requirePermission('VIEW_PRODUCT'), productController.getAdminList);

module.exports = router;