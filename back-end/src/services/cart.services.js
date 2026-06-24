const db = require('../configs/database.config');

const addToCart = async (userId, productId, size, quantity) => {
    // 1. Kiểm tra xem sản phẩm + size này đã có trong giỏ hàng của user chưa
    const [existingItems] = await db.execute(
        'SELECT id, quantity FROM carts WHERE user_id = ? AND product_id = ? AND size = ?',
        [userId, productId, size]
    );

    if (existingItems.length > 0) {
        // 2a. Nếu đã có -> Cộng dồn số lượng
        const currentItem = existingItems[0];
        const newQuantity = currentItem.quantity + quantity;

        await db.execute(
            'UPDATE carts SET quantity = ? WHERE id = ?',
            [newQuantity, currentItem.id]
        );
        return currentItem.id;
    } else {
        // 2b. Nếu chưa có -> Thêm dòng mới
        const [result] = await db.execute(
            'INSERT INTO carts (user_id, product_id, size, quantity) VALUES (?, ?, ?, ?)',
            [userId, productId, size, quantity]
        );
        return result.insertId;
    }
};

const updateCartQuantity = async (userId, cartId, quantity) => {
    // Kiểm tra xem item này có đúng là của user đang request không (Bảo mật)
    const [existingItems] = await db.execute(
        'SELECT id FROM carts WHERE id = ? AND user_id = ?',
        [cartId, userId]
    );

    if (existingItems.length === 0) {
        throw new Error('CART_ITEM_NOT_FOUND');
    }

    // Cập nhật số lượng mới (Ghi đè, không cộng dồn)
    await db.execute(
        'UPDATE carts SET quantity = ? WHERE id = ?',
        [quantity, cartId]
    );
};

const removeCartItem = async (userId, cartId) => {
    // Kiểm tra quyền sở hữu trước khi xóa
    const [existingItems] = await db.execute(
        'SELECT id FROM carts WHERE id = ? AND user_id = ?',
        [cartId, userId]
    );

    if (existingItems.length === 0) {
        throw new Error('CART_ITEM_NOT_FOUND');
    }

    await db.execute('DELETE FROM carts WHERE id = ?', [cartId]);
};

// Bonus: Hàm lấy danh sách giỏ hàng (Kèm theo thông tin sản phẩm và ảnh bìa)
const getCartList = async (userId) => {
    const query = `
        SELECT c.id as cart_id, c.size, c.quantity,
               p.id as product_id, p.name_product, p.price_product,
               (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as cover_image
        FROM carts c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
        ORDER BY c.id DESC
    `;
    const [cartItems] = await db.execute(query, [userId]);
    return cartItems;
};

module.exports = {
    addToCart,
    updateCartQuantity,
    removeCartItem,
    getCartList
};