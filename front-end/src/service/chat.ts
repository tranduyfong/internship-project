// src/services/chat.ts
const BASE_URL = 'http://localhost:8000/api/chat';

// Hàm tạo Headers dùng chung, tự động tìm token an toàn
const getAuthHeaders = () => {
    // Thử lấy 'access_token', nếu không có thì thử lấy 'token'
    let token = localStorage.getItem('access_token') || localStorage.getItem('token') || '';

    // Xóa bỏ các dấu ngoặc kép thừa do JSON.stringify gây ra (nếu có)
    token = token.replace(/['"]+/g, '');

    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

export const customerChatService = {
    getUnreadCount: async () => {
        const res = await fetch(`${BASE_URL}/unread-count`, {
            method: 'GET',
            headers: getAuthHeaders() // Gọi hàm sinh header ở đây
        });
        return res.json();
    },

    getMessages: async (page = 1) => {
        const res = await fetch(`${BASE_URL}/rooms/me/messages?page=${page}`, {
            method: 'GET',
            headers: getAuthHeaders()
        });
        return res.json();
    },

    markAsRead: async (roomId: number) => {
        const res = await fetch(`${BASE_URL}/rooms/${roomId}/read`, {
            method: 'PATCH',
            headers: getAuthHeaders()
        });
        return res.json();
    }
};