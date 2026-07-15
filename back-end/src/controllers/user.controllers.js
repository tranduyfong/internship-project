const userService = require('../services/user.services');
const { successResponse, errorResponse } = require('../utils/response.util');

const search = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const role = req.query.role || null; // MỚI THÊM: Hứng role từ URL query

        let pageNumber = 0;
        if (req.query.pageNumber !== undefined && req.query.pageNumber !== '') {
            pageNumber = parseInt(req.query.pageNumber, 10);
        }

        let pageSize = 20;
        if (req.query.pageSize !== undefined && req.query.pageSize !== '') {
            pageSize = parseInt(req.query.pageSize, 10);
        }

        if (pageNumber < 0 || pageSize <= 0) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Tham số phân trang không hợp lệ', 400);
        }

        // Truyền thêm biến role xuống service
        const result = await userService.searchUsers({ keyword, role, pageNumber, pageSize });

        return successResponse(
            res,
            result.data,
            result.pagination,
            'Lấy danh sách người dùng thành công'
        );
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
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

const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId; // Lấy từ Token
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Vui lòng nhập mật khẩu cũ và mật khẩu mới', 400);
        }

        if (newPassword.length < 6) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Mật khẩu mới phải có ít nhất 6 ký tự', 400);
        }

        await userService.changeMyPassword(userId, oldPassword, newPassword);

        return successResponse(res, null, null, 'Đổi mật khẩu thành công');
    } catch (error) {
        if (error.message === 'WRONG_OLD_PASSWORD') {
            return errorResponse(res, 'VALIDATION_FAILED', 'Mật khẩu cũ không chính xác', 400);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const updateAccountByAdmin = async (req, res) => {
    try {
        const userId = req.params.id; // Lấy ID của user cần sửa từ URL
        const { name, phone, role } = req.body;

        if (!userId) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Thiếu ID tài khoản', 400);
        }

        await userService.updateUserByAdmin(userId, { name, phone, role });

        return successResponse(res, null, null, 'Cập nhật tài khoản thành công');
    } catch (error) {
        if (error.message === 'NO_DATA_TO_UPDATE') {
            return errorResponse(res, 'VALIDATION_FAILED', 'Không có dữ liệu để cập nhật', 400);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const changeStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const { status } = req.body; // 'ACTIVE' hoặc 'LOCKED'

        if (!userId || !status) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Thiếu ID người dùng hoặc trạng thái mới', 400);
        }

        await userService.toggleUserStatus(userId, status);

        return successResponse(
            res,
            null,
            null,
            status === 'LOCKED' ? 'Đã khóa tài khoản thành công' : 'Đã mở khóa tài khoản thành công'
        );
    } catch (error) {
        if (error.message === 'INVALID_STATUS') {
            return errorResponse(res, 'VALIDATION_FAILED', 'Trạng thái không hợp lệ (Chỉ nhận ACTIVE hoặc LOCKED)', 400);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const listAllPermissions = async (req, res) => {
    try {
        const permissions = await userService.getAllPermissions();
        return successResponse(res, permissions, null, 'Lấy danh sách tất cả các quyền thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const getStaffPermissions = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Thiếu ID người dùng', 400);
        }
        const permissions = await userService.getUserPermissions(userId);
        return successResponse(res, permissions, null, 'Lấy quyền của nhân viên thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const assignPermissions = async (req, res) => {
    try {
        const userId = req.params.id;
        const { permissionIds } = req.body; // Nhận mảng ID ví dụ: [1, 3, 4]

        if (!userId) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Thiếu ID người dùng', 400);
        }
        if (!Array.isArray(permissionIds)) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Danh sách quyền gửi lên không hợp lệ (Phải là mảng)', 400);
        }

        await userService.updateUserPermissions(userId, permissionIds);
        return successResponse(res, null, null, 'Cập nhật quyền cho nhân viên thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    search,
    getDetail,
    getMe,
    updateMe,
    addAddress, updateAddress, deleteAddress,
    setDefaultAddress,
    changePassword,
    updateAccountByAdmin,
    changeStatus,
    listAllPermissions,
    getStaffPermissions,
    assignPermissions
};