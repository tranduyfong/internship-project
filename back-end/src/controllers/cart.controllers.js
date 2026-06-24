const cartService = require('../services/cart.services');
const { successResponse, errorResponse } = require('../utils/response.util');

const add = async (req, res) => {
    try {
        const userId = req.user.userId; // Lấy từ token
        const { productId, size, quantity } = req.body;

        if (!productId || !size || !quantity || quantity <= 0) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Dữ liệu đầu vào không hợp lệ', 400);
        }

        const cartId = await cartService.addToCart(userId, productId, size, quantity);

        return successResponse(res, { cartId }, null, 'Đã thêm vào giỏ hàng', 201);
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const updateQuantity = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cartId = req.params.id; // Lấy ID của record trong giỏ hàng
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return errorResponse(res, 'VALIDATION_FAILED', 'Số lượng không hợp lệ', 400);
        }

        await cartService.updateCartQuantity(userId, cartId, quantity);

        return successResponse(res, null, null, 'Cập nhật số lượng thành công');
    } catch (error) {
        if (error.message === 'CART_ITEM_NOT_FOUND') {
            return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Không tìm thấy sản phẩm trong giỏ', 404);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const remove = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cartId = req.params.id;

        await cartService.removeCartItem(userId, cartId);

        return successResponse(res, null, null, 'Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
        if (error.message === 'CART_ITEM_NOT_FOUND') {
            return errorResponse(res, 'RESOURCE_NOT_FOUND', 'Không tìm thấy sản phẩm trong giỏ', 404);
        }
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

const getList = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cartItems = await cartService.getCartList(userId);

        return successResponse(res, cartItems, null, 'Lấy giỏ hàng thành công');
    } catch (error) {
        return errorResponse(res, 'INTERNAL_SERVER_ERROR', 'Lỗi hệ thống', 500, null, error.message);
    }
};

module.exports = {
    add,
    updateQuantity,
    remove,
    getList
};