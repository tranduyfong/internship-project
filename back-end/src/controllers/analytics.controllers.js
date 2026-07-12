const analyticsService = require('../services/analytics.services');
const { successResponse, errorResponse } = require('../utils/response.util');

const getRevenue = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Vui lòng cung cấp startDate và endDate', 400);
        }

        // Bổ sung thời gian cụ thể để query bao phủ trọn vẹn ngày cuối cùng (đến 23:59:59)
        const start = `${startDate} 00:00:00`;
        const end = `${endDate} 23:59:59`;

        const data = await analyticsService.getRevenueReport(start, end);

        return successResponse(res, data, null, 'Lấy báo cáo doanh thu thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const getProductSales = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Vui lòng cung cấp startDate và endDate', 400);
        }

        const start = `${startDate} 00:00:00`;
        const end = `${endDate} 23:59:59`;

        const data = await analyticsService.getProductSalesReport(start, end);

        return successResponse(res, data, null, 'Lấy báo cáo sản phẩm bán ra thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const getTopCustomers = async (req, res) => {
    try {
        const { startDate, endDate, limit } = req.query;

        if (!startDate || !endDate) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Vui lòng cung cấp startDate và endDate', 400);
        }

        const start = `${startDate} 00:00:00`;
        const end = `${endDate} 23:59:59`;
        const topLimit = parseInt(limit) || 10; // Mặc định lấy Top 10 nếu không truyền

        const data = await analyticsService.getTopCustomersReport(start, end, topLimit);

        return successResponse(res, data, null, 'Lấy báo cáo khách hàng VIP thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const getOrderStatus = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Vui lòng cung cấp startDate và endDate', 400);
        }

        const start = `${startDate} 00:00:00`;
        const end = `${endDate} 23:59:59`;

        const data = await analyticsService.getOrderStatusReport(start, end);
        return successResponse(res, data, null, 'Thống kê trạng thái đơn hàng thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    getRevenue,
    getProductSales,
    getTopCustomers,
    getOrderStatus
};