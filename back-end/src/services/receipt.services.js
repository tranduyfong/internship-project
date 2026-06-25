const db = require('../configs/database.config');

const createReceipt = async (userId, data) => {
    const {
        fullName, phone, email, note, paymentMethod,
        addressDetail, province, district, ward,
        checkoutItems, totalAmount
    } = data;

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Luôn khóa các item theo một chiều cố định (từ ID nhỏ đến lớn)
        const sortedItems = [...checkoutItems].sort((a, b) => a.id - b.id);

        // 1. KIỂM TRA VÀ TRỪ TỒN KHO AN TOÀN (Pessimistic Locking)
        for (const item of checkoutItems) {
            // Dùng FOR UPDATE để khóa dòng dữ liệu size này lại, ngăn người khác can thiệp
            const [stockData] = await connection.execute(
                'SELECT quantity FROM product_sizes WHERE product_id = ? AND size = ? FOR UPDATE',
                [item.id, item.size]
            );

            if (stockData.length === 0) {
                throw new Error(`Sản phẩm ID ${item.id} size ${item.size} không tồn tại.`);
            }

            const currentStock = stockData[0].quantity;
            if (currentStock < item.quantity) {
                throw new Error(`Sản phẩm ${item.name} (Size ${item.size}) chỉ còn ${currentStock} sản phẩm.`);
            }

            // Trừ tồn kho
            await connection.execute(
                'UPDATE product_sizes SET quantity = quantity - ? WHERE product_id = ? AND size = ?',
                [item.quantity, item.id, item.size]
            );
        }

        // 2. TẠO MÃ ĐƠN HÀNG DUY NHẤT
        const orderCode = 'DH' + Date.now().toString().slice(-6) + Math.floor(100 + Math.random() * 900);
        const fullAddress = `${addressDetail}, ${ward.name}, ${district.name}, ${province.name}`;

        // 3. LƯU VÀO BẢNG RECEIPTS
        const [receiptResult] = await connection.execute(
            `INSERT INTO receipts 
             (user_id, order_code, total_amount, payment_method, payment_status, order_status, shipping_full_name, shipping_phone, shipping_address) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId, orderCode, totalAmount, paymentMethod.toUpperCase(),
                'Pending', 'processing', fullName, phone, fullAddress
            ]
        );
        const receiptId = receiptResult.insertId;

        // 4. LƯU VÀO BẢNG RECEIPT_ITEMS (Chi tiết đơn hàng)
        const receiptItemsData = checkoutItems.map(item => [
            receiptId, item.id, item.name, item.cover_image || null,
            item.price, item.size, item.quantity
        ]);

        await connection.query(
            'INSERT INTO receipt_items (receipt_id, product_id, name_product, img_src, price_at_time, size, quantity) VALUES ?',
            [receiptItemsData]
        );

        // 5. NẾU LÀ ĐƠN HÀNG THÀNH CÔNG -> XÓA CÁC SẢN PHẨM ĐÓ KHỎI GIỎ HÀNG
        const productIdsToRemove = checkoutItems.map(i => i.id);
        const placeholders = productIdsToRemove.map(() => '?').join(',');
        await connection.execute(
            `DELETE FROM carts WHERE user_id = ? AND product_id IN (${placeholders})`,
            [userId, ...productIdsToRemove]
        );

        await connection.commit();

        return { receiptId, orderCode, totalAmount };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// CẬP NHẬT: Hoàn tồn kho an toàn, tránh trùng lặp dữ liệu
const restoreInventory = async (orderCode) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Khóa dòng receipt để kiểm tra trạng thái hiện tại, tránh double-restore
        const [receipts] = await connection.execute(
            "SELECT payment_status FROM receipts WHERE order_code = ? FOR UPDATE",
            [orderCode]
        );

        if (receipts.length === 0) {
            await connection.rollback();
            return;
        }

        // Nếu trạng thái đã là Failed hoặc Cancelled rồi thì dừng lại, không hoàn kho tiếp
        if (receipts[0].payment_status === 'Failed' || receipts[0].payment_status === 'Cancelled') {
            await connection.rollback();
            return;
        }

        // Cập nhật trạng thái đơn thành Failed
        await connection.execute(
            "UPDATE receipts SET payment_status = 'Failed', order_status = 'cancelled' WHERE order_code = ?",
            [orderCode]
        );

        // Lấy danh sách mặt hàng để hoàn lại vào kho
        const [items] = await connection.execute(
            'SELECT product_id, size, quantity FROM receipt_items r JOIN receipts rs ON r.receipt_id = rs.id WHERE rs.order_code = ?',
            [orderCode]
        );

        for (const item of items) {
            await connection.execute(
                'UPDATE product_sizes SET quantity = quantity + ? WHERE product_id = ? AND size = ?',
                [item.quantity, item.product_id, item.size]
            );
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

// MỚI: Xử lý logic nghiệp vụ cho việc thanh toán lại hóa đơn cũ
const initiateRepay = async (userId, receiptId) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Kiểm tra đơn hàng hợp lệ và thuộc sở hữu của user
        const [receipts] = await connection.execute(
            "SELECT * FROM receipts WHERE id = ? AND user_id = ? FOR UPDATE",
            [receiptId, userId]
        );

        if (receipts.length === 0) throw new Error("RECEIPT_NOT_FOUND");
        const receipt = receipts[0];

        if (receipt.payment_status === 'Paid') throw new Error("ORDER_ALREADY_PAID");

        // 2. Lấy danh sách sản phẩm trong đơn để check kho
        const [items] = await connection.execute(
            "SELECT product_id, size, quantity, name_product FROM receipt_items WHERE receipt_id = ?",
            [receiptId]
        );

        // Nếu đơn hàng trước đó đã bị hủy/thất bại (tức là kho đã được hoàn trả), bây giờ phải trừ kho lại
        if (receipt.payment_status === 'Failed' || receipt.payment_status === 'Cancelled') {
            // Sắp xếp ID để tránh Deadlock hệ thống
            const sortedItems = [...items].sort((a, b) => a.product_id - b.product_id);

            for (const item of sortedItems) {
                const [stockData] = await connection.execute(
                    'SELECT quantity FROM product_sizes WHERE product_id = ? AND size = ? FOR UPDATE',
                    [item.product_id, item.size]
                );

                if (stockData.length === 0 || stockData[0].quantity < item.quantity) {
                    throw new Error(`Sản phẩm ${item.name_product} (Size ${item.size}) không đủ số lượng để thực hiện thanh toán lại.`);
                }

                // Trừ lại kho
                await connection.execute(
                    'UPDATE product_sizes SET quantity = quantity - ? WHERE product_id = ? AND size = ?',
                    [item.quantity, item.product_id, item.size]
                );
            }
        }

        // 3. Đưa trạng thái đơn hàng quay trở về xử lý Pending
        await connection.execute(
            "UPDATE receipts SET payment_status = 'Pending', order_status = 'processing' WHERE id = ?",
            [receiptId]
        );

        await connection.commit();
        return receipt;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const updatePaymentSuccess = async (orderCode) => {
    await db.execute(
        "UPDATE receipts SET payment_status = 'Paid' WHERE order_code = ?",
        [orderCode]
    );
};

const getMyReceipts = async (userId) => {
    // 1. Lấy danh sách các hóa đơn của user này (Sắp xếp mới nhất lên đầu)
    const [receipts] = await db.execute(
        'SELECT * FROM receipts WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
    );

    // Nếu không có đơn hàng nào thì trả về mảng rỗng luôn
    if (receipts.length === 0) {
        return [];
    }

    // 2. Lấy danh sách ID của các hóa đơn này để query chi tiết sản phẩm
    const receiptIds = receipts.map(r => r.id);
    const placeholders = receiptIds.map(() => '?').join(',');

    const [items] = await db.execute(
        `SELECT id, receipt_id, product_id, name_product, img_src, price_at_time, size, quantity 
         FROM receipt_items 
         WHERE receipt_id IN (${placeholders})`,
        receiptIds
    );

    // 3. Gom nhóm các item vào đúng hóa đơn của nó bằng JavaScript
    const itemsByReceipt = items.reduce((acc, item) => {
        if (!acc[item.receipt_id]) {
            acc[item.receipt_id] = [];
        }
        acc[item.receipt_id].push(item);
        return acc;
    }, {});

    // 4. Gắn mảng items vào từng receipt tương ứng
    receipts.forEach(receipt => {
        receipt.items = itemsByReceipt[receipt.id] || [];
    });

    return receipts;
};

module.exports = {
    createReceipt,
    restoreInventory,
    updatePaymentSuccess,
    getMyReceipts,
    initiateRepay
};