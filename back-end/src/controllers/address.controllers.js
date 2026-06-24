const addressService = require('../services/address.services');
const { successResponse, errorResponse } = require('../utils/response.util');

const getAllProvinces = async (req, res) => {
    try {
        const provinces = await addressService.getProvinces();
        return successResponse(res, provinces, null, 'Lấy danh sách Tỉnh/Thành phố thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi khi lấy dữ liệu địa chỉ', 500, null, error.message);
    }
};

const getDistricts = async (req, res) => {
    try {
        const provinceCode = req.params.provinceCode;
        const districts = await addressService.getDistrictsByProvince(provinceCode);
        return successResponse(res, districts, null, 'Lấy danh sách Quận/Huyện thành công');
    } catch (error) {
        if (error.message === 'PROVINCE_NOT_FOUND') {
            return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Mã Tỉnh/Thành phố không tồn tại', 404);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi khi lấy dữ liệu địa chỉ', 500, null, error.message);
    }
};

const getWards = async (req, res) => {
    try {
        const districtCode = req.params.districtCode;
        const wards = await addressService.getWardsByDistrict(districtCode);
        return successResponse(res, wards, null, 'Lấy danh sách Phường/Xã thành công');
    } catch (error) {
        if (error.message === 'DISTRICT_NOT_FOUND') {
            return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Mã Quận/Huyện không tồn tại', 404);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi khi lấy dữ liệu địa chỉ', 500, null, error.message);
    }
};

module.exports = {
    getAllProvinces,
    getDistricts,
    getWards
};