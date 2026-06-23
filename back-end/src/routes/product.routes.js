const express = require('express');
const productController = require('../controllers/product.controllers');
const { verifyToken, verifyAdminOrStaff } = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/search', productController.getList);
router.get('/:id', productController.getDetail);
router.post('/', verifyToken, verifyAdminOrStaff, uploadMiddleware, productController.create);

module.exports = router;