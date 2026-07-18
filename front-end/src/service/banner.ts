// src/service/banner.ts
const BASE_URL = 'http://localhost:8000/api';

export const bannerService = {
    getBanners: async () => {
        const res = await fetch(`${BASE_URL}/banners`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const json = await res.json();

        if (!res.ok || json.code !== 'SUCCESS') {
            throw new Error(json.message || 'Lỗi tải danh sách banner');
        }

        return json.data;
    }
};