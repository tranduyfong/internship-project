const express = require('express');
const userController = require('../controllers/user.controllers');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/search', verifyToken, verifyAdmin, userController.search);
router.get('/:id', verifyToken, verifyAdmin, userController.getDetail);

module.exports = router;