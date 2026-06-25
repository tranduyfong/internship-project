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

const getMe = async (req, res) => {
    try {
        const userId = req.user.userId; // Trích xuất tự động từ Token
        const user = await userService.getMyProfile(userId);
        return successResponse(res, user, null, 'Lấy thông tin cá nhân thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const updateMe = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, phone } = req.body;

        if (!name || !phone) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Tên và số điện thoại là bắt buộc', 400);
        }

        await userService.updateMyProfile(userId, { name, phone });
        return successResponse(res, null, null, 'Cập nhật thông tin thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const addAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { city, city_code, district, district_code, village, ward_code, more, is_default } = req.body;

        // Đã sửa Validation: Cho phép trường 'more' có thể rỗng, chỉ bắt buộc các trường chính
        if (!city || !city_code || !district || !district_code || !village || !ward_code) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Vui lòng điền đầy đủ Tỉnh/Thành phố, Quận/Huyện, Phường/Xã và các mã code', 400);
        }

        const addressId = await userService.addMyAddress(userId, {
            city, city_code, district, district_code, village, ward_code, more: more || '', is_default
        });

        return successResponse(res, { addressId }, null, 'Thêm địa chỉ thành công', 201);
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const updateAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const addressId = req.params.addressId;
        const { city, city_code, district, district_code, village, ward_code, more, is_default } = req.body;

        if (!city || !city_code || !district || !district_code || !village || !ward_code) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Vui lòng điền đầy đủ Tỉnh/Thành phố, Quận/Huyện, Phường/Xã và các mã code', 400);
        }

        await userService.updateMyAddress(userId, addressId, {
            city, city_code, district, district_code, village, ward_code, more: more || '', is_default
        });

        return successResponse(res, null, null, 'Cập nhật địa chỉ thành công');
    } catch (error) {
        if (error.message === 'ADDRESS_NOT_FOUND') {
            return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Không tìm thấy địa chỉ', 404);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const addressId = req.params.addressId;

        await userService.deleteMyAddress(userId, addressId);

        return successResponse(res, null, null, 'Xóa địa chỉ thành công');
    } catch (error) {
        if (error.message === 'ADDRESS_NOT_FOUND') {
            return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Không tìm thấy địa chỉ', 404);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const setDefaultAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const addressId = req.params.addressId;

        await userService.setAddressDefault(userId, addressId);
        return successResponse(res, null, null, 'Đã cập nhật địa chỉ mặc định');
    } catch (error) {
        if (error.message === 'ADDRESS_NOT_FOUND') {
            return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Không tìm thấy địa chỉ', 404);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    search,
    getDetail,
    getMe,
    updateMe,
    addAddress, updateAddress, deleteAddress,
    setDefaultAddress
};