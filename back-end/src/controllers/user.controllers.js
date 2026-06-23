const userService = require('../services/user.services');
const { successResponse, errorResponse } = require('../utils/response.util');

const search = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';

        // Kiểm tra và lấy giá trị pageNumber mặc định là 0
        let pageNumber = 0;
        if (req.query.pageNumber !== undefined && req.query.pageNumber !== '') {
            pageNumber = parseInt(req.query.pageNumber, 10);
        }

        // Kiểm tra và lấy giá trị pageSize mặc định là 20
        let pageSize = 20;
        if (req.query.pageSize !== undefined && req.query.pageSize !== '') {
            pageSize = parseInt(req.query.pageSize, 10);
        }

        if (pageNumber < 0 || pageSize <= 0) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Invalid pagination parameters', 400);
        }

        const result = await userService.searchUsers({ keyword, pageNumber, pageSize });

        return successResponse(
            res,
            result.data,
            result.pagination,
            'Users retrieved successfully'
        );
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Something went wrong', 500, null, error.message);
    }
};

const getDetail = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userService.getUserById(userId);

        return successResponse(res, user, null, 'Lấy chi tiết người dùng thành công');
    } catch (error) {
        if (error.message === 'USER_NOT_FOUND') {
            return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Không tìm thấy người dùng', 404);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    search,
    getDetail
};