const bannerService = require('../services/banner.services');
const { successResponse, errorResponse } = require('../utils/response.util');

const create = async (req, res) => {
    try {
        const { target_link } = req.body;
        // Tùy theo cấu hình multer, file có thể nằm trong req.file hoặc req.files
        const file = req.file || req.files;

        const bannerId = await bannerService.createBanner(file, target_link);
        return successResponse(res, { id: bannerId }, null, 'Thêm banner thành công', 201);
    } catch (error) {
        if (error.message === 'NO_IMAGE') {
            return errorResponse(res, 'VALIDATION_FAILED', 'Vui lòng tải lên hình ảnh cho banner', 400);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const getPublicList = async (req, res) => {
    try {
        const banners = await bannerService.getActiveBanners();
        return successResponse(res, banners, null, 'Lấy danh sách banner thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const getAdminList = async (req, res) => {
    try {
        const banners = await bannerService.getAllBannersAdmin();
        return successResponse(res, banners, null, 'Lấy danh sách banner cho Admin thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const update = async (req, res) => {
    try {
        const bannerId = req.params.id;
        const { target_link, display_order, status } = req.body;

        await bannerService.updateBanner(bannerId, { target_link, display_order, status });
        return successResponse(res, null, null, 'Cập nhật banner thành công');
    } catch (error) {
        if (error.message === 'BANNER_NOT_FOUND') return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Không tìm thấy banner', 404);
        if (error.message === 'NO_DATA_TO_UPDATE') return errorResponse(res, 'VALIDATION_FAILED', 'Không có dữ liệu cập nhật', 400);
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const remove = async (req, res) => {
    try {
        const bannerId = req.params.id;
        await bannerService.deleteBanner(bannerId);
        return successResponse(res, null, null, 'Xóa banner thành công');
    } catch (error) {
        if (error.message === 'BANNER_NOT_FOUND') return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Không tìm thấy banner', 404);
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    create,
    getPublicList,
    getAdminList,
    update,
    remove
};