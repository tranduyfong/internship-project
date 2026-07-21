const mapService = require('../services/map.services');
const { successResponse, errorResponse } = require('../utils/response.util');

const getFacilitiesOnMap = async (req, res) => {
    try {
        const zoom = parseFloat(req.query.zoom) || 5; // Mặc định zoom 5 nếu không truyền

        // Hứng 4 tọa độ tạo thành hình chữ nhật (Bounding Box) của màn hình
        const bounds = {
            minLat: parseFloat(req.query.minLat) || -90,
            maxLat: parseFloat(req.query.maxLat) || 90,
            minLng: parseFloat(req.query.minLng) || -180,
            maxLng: parseFloat(req.query.maxLng) || 180
        };

        const mapData = await mapService.getMapClusters(zoom, bounds);

        return successResponse(res, mapData, null, 'Lấy dữ liệu bản đồ thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    getFacilitiesOnMap
};