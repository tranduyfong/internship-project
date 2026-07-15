const express = require('express');
const chatController = require('../controllers/chat.controllers');
const { verifyToken } = require('../middlewares/auth.middleware');
const { requirePermission } = require('../middlewares/permission.middleware');

const router = express.Router();

// 1. API dành cho Nhân viên/Admin (Cần quyền CHAT_CUSTOMER)
// Lấy danh sách các khách đã nhắn tin
router.get('/admin/rooms', verifyToken, requirePermission('CHAT_CUSTOMER'), chatController.getRoomList);

// Lấy lịch sử chat của 1 phòng cụ thể (Khách hoặc Admin đều xài chung logic Controller)
router.get('/rooms/:roomId/messages', verifyToken, chatController.getMessageHistory);

// Đánh dấu đã đọc
router.patch('/rooms/:roomId/read', verifyToken, chatController.markAsRead);

router.get('/unread-count', verifyToken, chatController.getUnreadBadge);

module.exports = router;