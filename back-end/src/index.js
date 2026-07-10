require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http'); // 1. Thêm thư viện http
const rootRoutes = require('./routes/index');
const socketConfig = require('./configs/socket.config'); // 2. Thêm file cấu hình Socket

const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app); // 3. Tạo HTTP server bọc lấy Express app

// 4. Khởi tạo Socket.io
const io = socketConfig.init(server);

// Lắng nghe khi có khách hàng truy cập web
io.on('connection', (socket) => {
    console.log('🟢 Một khách hàng mới vừa truy cập web! Socket ID:', socket.id);

    socket.on('disconnect', () => {
        console.log('🔴 Khách hàng đã thoát web:', socket.id);
    });
});

// Tự động tạo thư mục lưu ảnh nếu chưa tồn tại
const uploadDir = path.join(__dirname, '../uploads/products');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middlewares cơ bản
app.use(cors());
app.use(express.json()); // Để parse body dạng JSON
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Kết nối các Routes
app.use('/api', rootRoutes);

// Xử lý Route Not Found (404) theo đúng chuẩn Response
app.use((req, res, next) => {
    const { errorResponse } = require('./utils/response.util');
    return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Endpoint not found', 404);
});

// Chạy server
const PORT = process.env.PORT || 8000;
// 5. Thay app.listen thành server.listen
server.listen(PORT, () => {
    console.log(`Server is running strongly on port ${PORT}`);
});