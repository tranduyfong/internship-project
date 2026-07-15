const inventoryService = require('../services/inventory.services');
const { successResponse, errorResponse } = require('../utils/response.util');

const addStockLog = async (req, res) => {
    try {
        const { productId, size, quantity, importPrice, reason } = req.body;

        if (!productId || !size || !quantity || !importPrice || !reason) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Vui lòng điền đầy đủ thông tin nhập kho', 400);
        }

        await inventoryService.addStock(productId, size, quantity, importPrice, reason);
        return successResponse(res, null, null, 'Cập nhật kho hàng thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const getStockReport = async (req, res) => {
    try {
        const data = await inventoryService.getStockReportByBrand();
        return successResponse(res, data, null, 'Lấy dữ liệu tồn kho theo hãng thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const getHistory = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Vui lòng cung cấp startDate và endDate', 400);
        }

        const start = `${startDate} 00:00:00`;
        const end = `${endDate} 23:59:59`;

        const data = await inventoryService.getImportHistory(start, end);
        return successResponse(res, data, null, 'Lấy lịch sử nhập kho thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    addStockLog,
    getStockReport,
    getHistory
};