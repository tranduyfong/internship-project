const db = require('../configs/database.config');

const getRevenueReport = async (startDate, endDate) => {
    // 1. Thống kê tổng quan (Tổng doanh thu và Tổng số đơn)
    const [summaryResult] = await db.execute(
        `SELECT 
            SUM(total_amount) as total_revenue, 
            COUNT(id) as total_orders 
         FROM receipts 
         WHERE payment_status NOT IN ('Failed', 'Cancelled') 
         AND created_at >= ? AND created_at <= ?`,
        [startDate, endDate]
    );

    // 2. Thống kê theo từng ngày (Để Frontend vẽ biểu đồ)
    const [chartData] = await db.execute(
        `SELECT 
            DATE(created_at) as date, 
            SUM(total_amount) as daily_revenue,
            COUNT(id) as daily_orders
         FROM receipts 
         WHERE payment_status NOT IN ('Failed', 'Cancelled') 
         AND created_at >= ? AND created_at <= ?
         GROUP BY DATE(created_at)
         ORDER BY DATE(created_at) ASC`,
        [startDate, endDate]
    );

    return {
        summary: {
            totalRevenue: summaryResult[0].total_revenue || 0,
            totalOrders: summaryResult[0].total_orders || 0
        },
        chartData: chartData
    };
};

const getProductSalesReport = async (startDate, endDate) => {
    // Lấy top các sản phẩm bán chạy nhất trong khoảng thời gian được chọn
    const [products] = await db.execute(
        `SELECT 
            ri.product_id, 
            ri.name_product, 
            ri.img_src,
            SUM(ri.quantity) as total_quantity_sold, 
            SUM(ri.quantity * ri.price_at_time) as total_revenue_generated
         FROM receipt_items ri
         JOIN receipts r ON ri.receipt_id = r.id
         WHERE r.payment_status NOT IN ('Failed', 'Cancelled') 
         AND r.created_at >= ? AND r.created_at <= ?
         GROUP BY ri.product_id, ri.name_product, ri.img_src
         ORDER BY total_quantity_sold DESC`,
        [startDate, endDate]
    );

    return products;
};

const getTopCustomersReport = async (startDate, endDate, limit = 10) => {
    const [customers] = await db.execute(
        `SELECT 
            u.id as user_id, 
            u.name as customer_name, 
            u.email, 
            u.phone,
            COUNT(r.id) as total_orders, 
            SUM(r.total_amount) as total_spent
         FROM users u
         JOIN receipts r ON u.id = r.user_id
         WHERE r.payment_status NOT IN ('Failed', 'Cancelled') 
         AND r.created_at >= ? AND r.created_at <= ?
         GROUP BY u.id, u.name, u.email, u.phone
         ORDER BY total_spent DESC
         LIMIT ${limit}`,
        [startDate, endDate]
    );

    return customers;
};

const getOrderStatusReport = async (startDate, endDate) => {
    const [statusCounts] = await db.execute(
        `SELECT order_status, COUNT(id) as total_orders
         FROM receipts
         WHERE created_at >= ? AND created_at <= ?
         GROUP BY order_status`,
        [startDate, endDate]
    );

    // Khởi tạo Object mặc định với 5 trạng thái theo đúng chuẩn FE của bạn
    const report = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
    };

    // Đổ dữ liệu từ Database vào Object
    statusCounts.forEach(row => {
        // Đề phòng db lưu chữ in hoa/thường lẫn lộn, ta đưa hết về lowercase
        const status = row.order_status ? row.order_status.toLowerCase() : '';
        if (report[status] !== undefined) {
            report[status] = row.total_orders;
        }
    });

    return report;
};

module.exports = {
    getRevenueReport,
    getProductSalesReport,
    getTopCustomersReport,
    getOrderStatusReport
};