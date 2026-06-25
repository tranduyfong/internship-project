// src/service/receipt.ts

// Thay thế bằng domain thực tế của bạn hoặc process.env.REACT_APP_API_URL
const BASE_URL = 'http://localhost:8000/api';

// Hàm tiện ích nội bộ để tự động gắn Token vào Request
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
};

export const receiptService = {
    checkout: async (payload: any) => {
        const res = await fetch(`${BASE_URL}/receipts/checkout`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Lỗi đặt hàng');
        return data;
    },

    getMyReceipts: async () => {
        const res = await fetch(`${BASE_URL}/receipts/me`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Lỗi tải danh sách đơn hàng');
        return data;
    },

    repay: async (id: number) => {
        const res = await fetch(`${BASE_URL}/receipts/${id}/repay`, {
            method: 'POST',
            headers: getAuthHeaders() // Tự động đính kèm Token như các hàm trên
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Lỗi tạo link thanh toán lại');
        return data;
    },

    verifyVnPayReturn: async (queryString: string) => {
        const res = await fetch(`${BASE_URL}/receipts/vnpay-return${queryString}`, {
            method: 'GET',
            headers: getAuthHeaders() // Truyền token nếu BE yêu cầu
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Lỗi xác thực thanh toán');
        return data;
    }
};