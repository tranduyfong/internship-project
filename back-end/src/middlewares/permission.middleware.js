const db = require('../configs/database.config');
const { errorResponse } = require('../utils/response.util');

const requirePermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.userId; // Lấy từ verifyToken
            const role = req.user.role;

            // 1. Nếu là Admin thì có "Kim Bài Miễn Tử", cho qua mọi trạm
            if (role === 'admin') {
                return next();
            }

            // 2. Nếu là khách hàng (USER) thì chặn đứng lập tức
            if (role === 'user') {
                return errorResponse(res, 'FORBIDDEN', 'Bạn không có quyền thực hiện thao tác này', 403);
            }

            // 3. Nếu là Nhân viên (STAFF), bắt đầu kiểm tra thẻ bài trong DB
            const [rows] = await db.execute(`
                SELECT p.code 
                FROM permissions p
                JOIN user_permissions up ON p.id = up.permission_id
                WHERE up.user_id = ? AND p.code = ?
            `, [userId, requiredPermission]);

            // Nếu mảng rỗng tức là nhân viên này không được Admin cấp quyền này
            if (rows.length === 0) {
                return errorResponse(res, 'FORBIDDEN', `Nhân viên thiếu quyền hạn: ${requiredPermission}`, 403);
            }

            // Hợp lệ, cho phép đi tiếp vào Controller
            next();
        } catch (error) {
            return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi kiểm tra quyền hạn', 500, null, error.message);
        }
    };
};

module.exports = { requirePermission };