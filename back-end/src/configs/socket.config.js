const { Server } = require('socket.io');

let io;

module.exports = {
    // Hàm khởi tạo Socket đính kèm vào HTTP Server
    init: (httpServer) => {
        io = new Server(httpServer, {
            cors: {
                origin: "*", // Cho phép mọi Frontend kết nối (sau này có thể giới hạn lại tên miền của bạn)
                methods: ["GET", "POST"]
            }
        });
        return io;
    },

    // Hàm lấy instance của Socket để dùng ở các Controller
    getIO: () => {
        if (!io) {
            throw new Error('Socket.io chưa được khởi tạo!');
        }
        return io;
    }
};