const facilityService = require('../services/facility.services');
const { successResponse, errorResponse } = require('../utils/response.util');

const getAll = async (req, res) => {
    try {
        const facilities = await facilityService.getAllFacilities();
        return successResponse(res, facilities, null, 'Lấy danh sách cơ sở thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const create = async (req, res) => {
    try {
        const { name, address, region, province, latitude, longitude, google_map_url } = req.body;

        // Validate sương sương
        if (!name || !latitude || !longitude) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Tên và tọa độ không được để trống', 400);
        }

        const insertId = await facilityService.createFacility({
            name, address, region, province, latitude, longitude, google_map_url
        });

        return successResponse(res, { id: insertId }, null, 'Thêm cơ sở mới thành công', 201);
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const update = async (req, res) => {
    try {
        const facilityId = req.params.id;
        // Dùng destructuring lấy toàn bộ body truyền xuống service
        await facilityService.updateFacility(facilityId, req.body);

        return successResponse(res, null, null, 'Cập nhật thông tin cơ sở thành công');
    } catch (error) {
        if (error.message === 'FACILITY_NOT_FOUND') return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Không tìm thấy cơ sở', 404);
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const remove = async (req, res) => {
    try {
        const facilityId = req.params.id;
        await facilityService.deleteFacility(facilityId);

        return successResponse(res, null, null, 'Xóa cơ sở thành công');
    } catch (error) {
        if (error.message === 'FACILITY_NOT_FOUND') {
            return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Không tìm thấy cơ sở', 404);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    getAll,
    create,
    update,
    remove
};