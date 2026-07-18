const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const chatService = require('../services/chat.services');

let io;

module.exports = {
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

            // SỬA Ở ĐÂY: NẾU KHÔNG CÓ TOKEN, ĐÓN TIẾP NHƯ KHÁCH VÃNG LAI (GUEST)
            if (!token) {
                socket.user = { role: 'GUEST' };
                return next();
            }

            try {
                // Xóa ngoặc kép thừa nếu có
                const cleanToken = token.replace(/['"]+/g, '');
                const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
                socket.user = decoded;
                next();
            } catch (error) {
                // NẾU TOKEN HẾT HẠN HOẶC LỖI, CŨNG CHO LÀM GUEST THAY VÌ BÁO LỖI VÀ CHẶN KẾT NỐI
                console.error("Lỗi giải mã token, chuyển thành GUEST");
                socket.user = { role: 'GUEST' };
                return next();
            }
        });

        io.on('connection', (socket) => {
            // SỬA Ở ĐÂY: Dùng id của socket làm mã tạm thời nếu là GUEST
            const userId = socket.user?.id || socket.user?.userId || socket.id;
            const role = (socket.user?.role || 'GUEST').toUpperCase();

            console.log(`Thiết bị kết nối Socket - ID: ${userId} - Role: ${role}`);

            // THỦ THUẬT MỚI: NẾU LÀ NHÂN VIÊN, TỰ ĐỘNG CHO VÀO "QUẦY TRỰC BAN"
            if (role === 'ADMIN' || role === 'STAFF') {
                socket.join('staff_desk');
            }

            // Sự kiện Join Phòng chat cụ thể (Để nhắn tin)
            socket.on('join_chat', (roomId) => {
                // Guest không được join phòng chat nội bộ
                if (role !== 'GUEST') {
                    socket.join(roomId.toString());
                    console.log(`User ${userId} đã join phòng ${roomId}`);
                }
            });

            // Sự kiện Gửi Tin Nhắn
            socket.on('send_message', async (data) => {
                // Khách vãng lai không được nhắn tin
                if (role === 'GUEST') return;

                try {
                    const senderType = (role === 'ADMIN' || role === 'STAFF') ? 'STAFF' : 'CUSTOMER';

                    const messageData = {
                        roomId: data.roomId,
                        senderId: userId,
                        senderType: senderType,
                        message: data.message
                    };

                    await chatService.saveMessage(
                        messageData.roomId,
                        messageData.senderId,
                        messageData.senderType,
                        messageData.message
                    );

                    io.to(data.roomId.toString()).emit('receive_message', messageData);

                    if (senderType === 'CUSTOMER') {
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

    getIO: () => {
        if (!io) {
            throw new Error('Socket.io chưa được khởi tạo!');
        }
        return io;
    }
};