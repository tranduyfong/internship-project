// src/service/user.ts
import type { FullUserProfile } from '../types/user';

const BASE_URL = 'http://localhost:8000/api/users';
const getHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` });

export const userService = {
    getProfile: async (): Promise<{ data: FullUserProfile }> => {
        const res = await fetch(`${BASE_URL}/me`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Không thể tải hồ sơ');
        return res.json();
    },
    updateProfile: async (name: string, phone: string) => {
        const res = await fetch(`${BASE_URL}/me`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify({ name, phone }) });
        if (!res.ok) throw new Error('Cập nhật thất bại');
        return res.json();
    },
    addAddress: async (addressData: any) => {
        const res = await fetch(`${BASE_URL}/me/addresses`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(addressData) });
        if (!res.ok) throw new Error('Thêm địa chỉ thất bại');
        return res.json();
    },
    updateAddress: async (addressId: number, addressData: any) => {
        const res = await fetch(`${BASE_URL}/me/addresses/${addressId}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(addressData) });
        if (!res.ok) throw new Error('Cập nhật địa chỉ thất bại');
        return res.json();
    },
    deleteAddress: async (addressId: number) => {
        const res = await fetch(`${BASE_URL}/me/addresses/${addressId}`, { method: 'DELETE', headers: getHeaders() });
        if (!res.ok) throw new Error('Xóa địa chỉ thất bại');
        return res.json();
    },
    setDefaultAddress: async (addressId: number) => {
        const res = await fetch(`${BASE_URL}/me/addresses/${addressId}/default`, { method: 'PUT', headers: getHeaders() });
        if (!res.ok) throw new Error('Lỗi đặt mặc định');
        return res.json();
    }
};