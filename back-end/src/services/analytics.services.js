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

// 1. Thống kê Doanh thu - Giá vốn - Lợi nhuận ròng
const getProfitReport = async (startDate, endDate) => {
    const [report] = await db.execute(
        `SELECT 
            SUM(ri.quantity * ri.price_at_time) as total_revenue,
            SUM(ri.quantity * ri.import_price_at_time) as total_cost,
            SUM(ri.quantity * ri.price_at_time) - SUM(ri.quantity * ri.import_price_at_time) as total_profit
         FROM receipt_items ri
         JOIN receipts r ON ri.receipt_id = r.id
         WHERE r.payment_status NOT IN ('Failed', 'Cancelled')
         AND r.created_at >= ? AND r.created_at <= ?`,
        [startDate, endDate]
    );

    return {
        revenue: report[0].total_revenue || 0,
        cost: report[0].total_cost || 0,
        profit: report[0].total_profit || 0
    };
};

// 2. Thống kê doanh số bán ra của các hãng trong khoảng thời gian tùy chọn
const getBrandSalesByRange = async (startDate, endDate) => {
    const [sales] = await db.execute(
        `SELECT p.brand, SUM(ri.quantity) as total_sold
         FROM receipt_items ri
         JOIN receipts r ON ri.receipt_id = r.id
         JOIN products p ON ri.product_id = p.id
         WHERE r.payment_status NOT IN ('Failed', 'Cancelled')
         AND r.created_at >= ? AND r.created_at <= ?
         GROUP BY p.brand`,
        [startDate, endDate]
    );
    return sales;
};

// 3. TỐI ƯU SÁNG TẠO: So sánh doanh số 4 hãng giày giữa 2 tháng (Trả về 1 cấu trúc mảng duy nhất vẽ biểu đồ)
const compareBrandsBetweenMonths = async (month1, month2) => {
    // Định dạng month1, month2 truyền vào dạng 'YYYY-MM' (Ví dụ: '2026-06')
    const startM1 = `${month1}-01 00:00:00`;
    const endM1 = `${month1}-31 23:59:59`;

    const startM2 = `${month2}-01 00:00:00`;
    const endM2 = `${month2}-31 23:59:59`;

    // Lấy doanh số tháng 1
    const salesM1 = await getBrandSalesByRange(startM1, endM1);
    // Lấy doanh số tháng 2
    const salesM2 = await getBrandSalesByRange(startM2, endM2);

    const brands = ['Nike', 'Adidas', 'Puma'];

    // Gộp dữ liệu thành cấu trúc cực đẹp cho Frontend vẽ biểu đồ cột nhóm (Grouped Column Chart)
    const comparisonResult = brands.map(brand => {
        const m1Data = salesM1.find(s => s.brand.toLowerCase() === brand.toLowerCase());
        const m2Data = salesM2.find(s => s.brand.toLowerCase() === brand.toLowerCase());

        return {
            brand: brand,
            [`Doanh số ${month1}`]: m1Data ? Number(m1Data.total_sold) : 0,
            [`Doanh số ${month2}`]: m2Data ? Number(m2Data.total_sold) : 0
        };
    });

    return comparisonResult;
};

const getInventoryAndSalesStats = async () => {
    // 1. Tổng số lượng sản phẩm CÒN LẠI trong kho
    const [totalStockResult] = await db.execute(
        'SELECT SUM(quantity) as total_stock FROM product_sizes'
    );

    // 2. Số lượng CÒN LẠI chia theo Hãng
    const [stockByBrand] = await db.execute(`
        SELECT p.brand, SUM(ps.quantity) as total_stock
        FROM products p
        JOIN product_sizes ps ON p.id = ps.product_id
        GROUP BY p.brand
    `);

    // 3. Tổng số lượng sản phẩm ĐÃ BÁN (Chỉ tính các đơn không bị Hủy/Thất bại)
    const [totalSoldResult] = await db.execute(`
        SELECT SUM(ri.quantity) as total_sold
        FROM receipt_items ri
        JOIN receipts r ON ri.receipt_id = r.id
        WHERE r.payment_status NOT IN ('Failed', 'Cancelled')
    `);

    // 4. Số lượng ĐÃ BÁN chia theo Hãng
    const [soldByBrand] = await db.execute(`
        SELECT p.brand, SUM(ri.quantity) as total_sold
        FROM receipt_items ri
        JOIN receipts r ON ri.receipt_id = r.id
        JOIN products p ON ri.product_id = p.id
        WHERE r.payment_status NOT IN ('Failed', 'Cancelled')
        GROUP BY p.brand
    `);

    return {
        overview: {
            totalStock: totalStockResult[0].total_stock || 0,
            totalSold: totalSoldResult[0].total_sold || 0
        },
        byBrand: {
            stock: stockByBrand,
            sold: soldByBrand
        }
    };
};

module.exports = {
    getRevenueReport,
    getProductSalesReport,
    getTopCustomersReport,
    getOrderStatusReport,
    getProfitReport,
    getBrandSalesByRange,
    compareBrandsBetweenMonths,
    getInventoryAndSalesStats
};