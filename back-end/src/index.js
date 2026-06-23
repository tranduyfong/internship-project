require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rootRoutes = require('./routes/index');

const fs = require('fs');
const path = require('path');

const app = express();

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
app.listen(PORT, () => {
    console.log(`Server is running strongly on port ${PORT}`);
});