const multer = require('multer');
const path = require('path');
const { errorResponse } = require('../utils/response.util');

// Cấu hình nơi lưu và tên file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads/products'));
    },
    filename: (req, file, cb) => {
        // Đổi tên file thành dạng: timestamp-ten-goc.jpg để tránh trùng lặp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Bộ lọc chỉ cho phép up ảnh
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép định dạng ảnh (JPEG, JPG, PNG, WEBP, GIF)'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn 5MB mỗi ảnh
});

// Middleware xử lý lỗi nếu up sai file
const uploadMiddleware = (req, res, next) => {
    // Cho phép up tối đa 5 ảnh cùng lúc với key là 'images'
    const uploadImages = upload.array('images', 5);

    uploadImages(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Lỗi upload ảnh: ' + err.message, 400);
        } else if (err) {
            return errorResponse(res, 'VALIDATION_FAILED', err.message, 400);
        }
        next();
    });
};

module.exports = uploadMiddleware;