import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/types';
import type { Banner } from '../types/types';

export const bannerService = {
    // API Public (Không cần token)
    getBanners: () => {
        return apiClient<ApiResponse<Banner[]>>('/banners', { method: 'GET' });
    },
    // Thêm mới (Cần FormData)
    createBanner: (formData: FormData) => {
        return apiClient<ApiResponse<{ id: number }>>('/banners/admin', {
            method: 'POST',
            body: formData
        });
    },
    // Cập nhật (Cần JSON)
    updateBanner: (id: number, data: { status: string; display_order: number; target_link: string }) => {
        return apiClient<ApiResponse<null>>(`/banners/admin/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        });
    },
    // Xóa
    deleteBanner: (id: number) => {
        return apiClient<ApiResponse<null>>(`/banners/admin/${id}`, { method: 'DELETE' });
    }
};