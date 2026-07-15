const chatService = require('../services/chat.services');
const { successResponse, errorResponse } = require('../utils/response.util');

const getRoomList = async (req, res) => {
    try {
        const rooms = await chatService.getRoomsForStaff();
        return successResponse(res, rooms, null, 'Lấy danh sách phòng chat thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const getMessageHistory = async (req, res) => {
    try {
        let roomId = req.params.roomId;
        const page = parseInt(req.query.page) || 1;
        const role = req.user.role;

        // Nếu là khách hàng (USER), họ gọi API không truyền roomId cũng được, hệ thống tự tìm
        if (role === 'user') {
            roomId = await chatService.getOrCreateRoom(req.user.userId);
        }

        if (!roomId) return errorResponse(res, 'VALIDATION_FAILED', 'Thiếu ID phòng chat', 400);

        const messages = await chatService.getMessages(roomId, page);

        return successResponse(res, messages, null, 'Lấy lịch sử tin nhắn thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const markAsRead = async (req, res) => {
    try {
        let roomId = req.params.roomId;
        const role = req.user.role;
        const readerType = role === 'user' ? 'customer' : 'staff';

        if (role === 'user') {
            roomId = await chatService.getOrCreateRoom(req.user.userId);
        }

        await chatService.markMessagesAsRead(roomId, readerType);
        return successResponse(res, null, null, 'Đã đánh dấu đọc tin nhắn');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    getRoomList,
    getMessageHistory,
    markAsRead
};