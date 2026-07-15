const { Server } = require('socket.io');
const chatService = require('../services/chat.services'); // Import service chat vào để gọi hàm lưu DB

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

        io.on('connection', (socket) => {
            console.log('Một thiết bị vừa kết nối Socket:', socket.id);

            socket.on('join_chat', (roomId) => {
                socket.join(`room_${roomId}`);
                console.log(`Thiết bị ${socket.id} đã join phòng: room_${roomId}`);
            });

            socket.on('send_message', async (data) => {
                const { roomId, senderId, senderType, message } = data;

                try {
                    const messageId = await chatService.saveMessage(roomId, senderId, senderType, message);

                    const newMessage = {
                        id: messageId,
                        room_id: roomId,
                        sender_id: senderId,
                        sender_type: senderType,
                        message: message,
                        is_read: 0,
                        created_at: new Date()
                    };

                    io.to(`room_${roomId}`).emit('receive_message', newMessage);

                    if (senderType === 'CUSTOMER') {
                        io.emit('new_customer_message', { roomId, message });
                    }

                } catch (error) {
                    console.error('Lỗi khi lưu tin nhắn real-time:', error);
                }
            });

            socket.on('disconnect', () => {
                console.log('Thiết bị ngắt kết nối Socket:', socket.id);
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