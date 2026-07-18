const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/'; // Thư mục gốc

        // Kiểm tra URL đang gọi API để phân loại thư mục lưu ảnh
        if (req.baseUrl.includes('products')) {
            folder += 'products/';
        } else if (req.baseUrl.includes('banners')) {
            folder += 'banners/';
        } else {
            folder += 'others/';
        }

        // Tự động tạo thư mục nếu trên máy chưa có (tránh lỗi sập server)
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        cb(null, folder);
    },
    filename: (req, file, cb) => {
        // Đổi tên file để tránh trùng lặp: timestamp_random_tên-gốc.đuôi-file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Bộ lọc chỉ cho phép tải lên hình ảnh
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép tải lên các định dạng hình ảnh (JPG, PNG, GIF, WEBP)'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB mỗi ảnh
});

const uploadMiddleware = upload.any();

module.exports = (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: `Lỗi upload: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
};