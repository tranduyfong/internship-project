const express = require('express');
const bannerController = require('../controllers/banner.controllers');
const { verifyToken } = require('../middlewares/auth.middleware');
const uploadMiddleware = require('../middlewares/upload.middleware');
const { requirePermission } = require('../middlewares/permission.middleware');

const router = express.Router();


router.get('/', bannerController.getPublicList);

router.get('/admin', verifyToken, requirePermission('VIEW_BANNER'), bannerController.getAdminList);
router.post('/admin', verifyToken, requirePermission('ADD_BANNER'), uploadMiddleware, bannerController.create);
router.put('/admin/:id', verifyToken, requirePermission('EDIT_BANNER'), bannerController.update);
router.delete('/admin/:id', verifyToken, requirePermission('DELETE_BANNER'), bannerController.remove);

module.exports = router;