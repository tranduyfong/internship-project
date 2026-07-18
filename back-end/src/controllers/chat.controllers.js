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
        let currentRoomId = req.params.roomId;
        const page = parseInt(req.query.page) || 1;
        const role = req.user.role;

        // Xử lý tự động tìm phòng cho Khách hàng
        if (role === 'user' || role === 'USER') {
            currentRoomId = await chatService.getOrCreateRoom(req.user.userId || req.user.id);
        }

        if (!currentRoomId) return errorResponse(res, 'VALIDATION_FAILED', 'Thiếu ID phòng chat', 400);

        const messages = await chatService.getMessages(currentRoomId, page);

        // TRẢ VỀ CẢ ROOM ID VÀ TIN NHẮN
        return successResponse(res, { roomId: currentRoomId, messages }, null, 'Lấy lịch sử tin nhắn thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const markAsRead = async (req, res) => {
    try {
        let currentRoomId = req.params.roomId;
        const role = req.user.role;
        const readerType = (role === 'user' || role === 'USER') ? 'customer' : 'staff';

        if (role === 'user' || role === 'USER') {
            currentRoomId = await chatService.getOrCreateRoom(req.user.userId || req.user.id);
        }

        await chatService.markMessagesAsRead(currentRoomId, readerType);
        return successResponse(res, null, null, 'Đã đánh dấu đọc tin nhắn');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const getUnreadBadge = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const role = req.user.role ? req.user.role.toUpperCase() : 'USER';

        const count = await chatService.getUnreadCount(userId, role);

        // KHAI BÁO BIẾN Ở ĐÂY ĐỂ TRÁNH LỖI "roomId is not defined"
        let fetchedRoomId = null;
        if (role === 'USER') {
            fetchedRoomId = await chatService.getOrCreateRoom(userId);
        }

        // TRẢ VỀ CẢ SỐ LƯỢNG VÀ ID PHÒNG
        return successResponse(res, { unreadCount: count, roomId: fetchedRoomId }, null, 'Lấy số tin nhắn chưa đọc thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    getRoomList,
    getMessageHistory,
    markAsRead,
    getUnreadBadge
};