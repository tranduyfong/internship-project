import { apiClient } from './apiClient';
import type { ApiResponse, Product } from '../types/types';

export const productService = {
    searchAdminProducts: (keyword: string, pageNumber: number, pageSize: number = 10) => {
        return apiClient<ApiResponse<Product[]>>(`/products/admin/search?keyword=${encodeURIComponent(keyword)}&pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: 'GET',
        });
    }
};