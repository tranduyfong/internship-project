const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const chatService = require('../services/chat.services');

let io;

module.exports = {
    // Hàm khởi tạo Socket đính kèm vào HTTP Server
    init: (httpServer) => {
        io = new Server(httpServer, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        io.use((socket, next) => {
            let token = null;

            if (socket.handshake.auth && socket.handshake.auth.token) {
                token = socket.handshake.auth.token;
            }
            else if (socket.handshake.headers && socket.handshake.headers.authorization) {
                token = socket.handshake.headers.authorization.split(' ')[1];
            }

            console.log("Token trích xuất được là:", token ? "Đã có token" : "NULL");

            if (!token) {
                return next(new Error('Authentication Error: Không tìm thấy Token'));
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.user = decoded;
                next();
            } catch (error) {
                console.error("Lỗi giải mã token:", error.message);
                return next(new Error('Authentication Error: Token không hợp lệ hoặc đã hết hạn'));
            }
        });

        io.on('connection', (socket) => {
            const userId = socket.user.id || socket.user.userId;
            const role = (socket.user.role || 'USER').toUpperCase();

            console.log(`Thiết bị kết nối Socket - ID: ${userId} - Role: ${role}`);

            // THỦ THUẬT MỚI: NẾU LÀ NHÂN VIÊN, TỰ ĐỘNG CHO VÀO "QUẦY TRỰC BAN"
            if (role === 'ADMIN' || role === 'STAFF') {
                socket.join('staff_desk');
            }

            // Sự kiện Join Phòng chat cụ thể (Để nhắn tin)
            socket.on('join_chat', (roomId) => {
                socket.join(roomId.toString());
                console.log(`User ${userId} đã join phòng ${roomId}`);
            });

            // Sự kiện Gửi Tin Nhắn
            socket.on('send_message', async (data) => {
                try {
                    const senderType = (role === 'ADMIN' || role === 'STAFF') ? 'STAFF' : 'CUSTOMER';

                    const messageData = {
                        roomId: data.roomId,
                        senderId: userId,
                        senderType: senderType,
                        message: data.message
                    };

                    // Lưu vào Database
                    await chatService.saveMessage(
                        messageData.roomId,
                        messageData.senderId,
                        messageData.senderType,
                        messageData.message
                    );

                    // 1. Phát tin nhắn lại cho những người ĐANG MỞ phòng này
                    io.to(data.roomId.toString()).emit('receive_message', messageData);

                    // 2. NẾU KHÁCH GỬI -> PHÁT THÔNG BÁO CHO TOÀN BỘ NHÂN VIÊN (A, B, C)
                    if (senderType === 'CUSTOMER') {
                        // Bắn thẳng vào 'staff_desk' thay vì bắn lung tung cho mọi người
                        io.to('staff_desk').emit('new_customer_message', messageData);
                    }
                } catch (error) {
                    console.error('Lỗi khi lưu tin nhắn real-time:', error);
                }
            });

            socket.on('disconnect', () => {
                console.log('User ngắt kết nối:', userId);
            });
        });

        return io;
    },

    // Hàm lấy instance của Socket để dùng ở các Controller khác (như lúc bạn dùng cho thông báo mua hàng VNPay)
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io chưa được khởi tạo!');
        }
        return io;
    }
};