const db = require('../configs/database.config');

// 1. Nghiệp vụ thêm hàng vào kho (Dùng cho cả Nhập mới và Hoàn trả hàng)
const addStock = async (productId, size, quantity, importPrice, reason) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Cập nhật tăng số lượng tồn kho và cập nhật giá nhập mới nhất cho size đó
        await connection.execute(
            `UPDATE product_sizes 
             SET quantity = quantity + ?, import_price = ? 
             WHERE product_id = ? AND size = ?`,
            [quantity, importPrice, productId, size]
        );

        // Ghi lại lịch sử vào bảng log (Lưu vết lý do hoàn hàng hoặc nhập mới)
        await connection.execute(
            `INSERT INTO inventory_logs (product_id, size, quantity_added, import_price, reason) 
             VALUES (?, ?, ?, ?, ?)`,
            [productId, size, quantity, importPrice, reason]
        );

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// 2. Thống kê số lượng tồn kho hiện tại phân theo 4 Hãng giày
const getStockReportByBrand = async () => {
    // Tính tổng số lượng giày còn lại trong kho phân theo cột 'brand' ở bảng products
    const [report] = await db.execute(
        `SELECT p.brand, SUM(ps.quantity) as remaining_stock
         FROM products p
         JOIN product_sizes ps ON p.id = ps.product_id
         GROUP BY p.brand`
    );
    return report;
};

// 3. Xem lịch sử nhập/hoàn hàng trong một khoảng thời gian
const getImportHistory = async (startDate, endDate) => {
    const [logs] = await db.execute(
        `SELECT il.id, p.name as product_name, il.size, il.quantity_added, il.import_price, il.reason, il.created_at
         FROM inventory_logs il
         JOIN products p ON il.product_id = p.id
         WHERE il.created_at >= ? AND il.created_at <= ?
         ORDER BY il.created_at DESC`,
        [startDate, endDate]
    );
    return logs;
};

module.exports = {
    addStock,
    getStockReportByBrand,
    getImportHistory
};