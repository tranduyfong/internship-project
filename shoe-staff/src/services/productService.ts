import { apiClient } from './apiClient';
import type { ApiResponse, Product, ProductDetail } from '../types/types';

export const productService = {
    searchAdminProducts: (keyword: string, pageNumber: number, pageSize: number = 10) => {
        return apiClient<ApiResponse<Product[]>>(`/products/admin/search?keyword=${encodeURIComponent(keyword)}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: 'GET',
        });
    },

    // Gọi API thêm sản phẩm bằng FormData
    createProduct: (formData: FormData) => {
        return apiClient<ApiResponse<{ id: number }>>('/products', {
            method: 'POST',
            body: formData,
        });
    },

    // Gọi API đổi trạng thái (Dừng bán)
    changeStatus: (productId: number, status: string) => {
        return apiClient<ApiResponse<null>>(`/products/${productId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
    },

    // API lấy chi tiết sản phẩm (GET)
    getProductDetail: (productId: number) => {
        return apiClient<ApiResponse<ProductDetail>>(`/products/${productId}`, {
            method: 'GET',
        });
    },

    // API cập nhật sản phẩm (PUT) - Có truyền FormData
    updateProduct: (productId: number, formData: FormData) => {
        return apiClient<ApiResponse<null>>(`/products/${productId}`, {
            method: 'PUT',
            body: formData,
        });
    }
};