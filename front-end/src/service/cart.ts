// src/service/cart.ts
import type { CartItem, CartResponse } from '../types/cart';

const BASE_URL = 'http://localhost:8000/api/cart';

// Hàm helper tự động lấy token
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const cartService = {
    // Lấy danh sách giỏ hàng
    getCart: async (): Promise<CartResponse<CartItem[]>> => {
        const response = await fetch(`${BASE_URL}/`, { headers: getAuthHeaders() });
        if (!response.ok) throw new Error('Không thể tải giỏ hàng');
        return response.json() as Promise<CartResponse<CartItem[]>>;
    },

    // Thêm vào giỏ hàng
    addToCart: async (productId: number, size: number, quantity: number): Promise<CartResponse<any>> => {
        const response = await fetch(`${BASE_URL}/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ productId, size, quantity })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Lỗi thêm giỏ hàng');
        return data;
    },

    // Cập nhật số lượng
    updateCartItem: async (cartId: number, quantity: number): Promise<CartResponse<any>> => {
        const response = await fetch(`${BASE_URL}/${cartId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ quantity })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Lỗi cập nhật số lượng');
        return data;
    },

    // Xóa sản phẩm khỏi giỏ
    deleteCartItem: async (cartId: number): Promise<CartResponse<any>> => {
        const response = await fetch(`${BASE_URL}/${cartId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Lỗi xóa sản phẩm');
        return data;
    }
};