// src/service/auth.ts
const BASE_URL = 'http://localhost:8000/api/auth';

// Định nghĩa cấu trúc chuẩn cho mọi Response từ Server của bạn
export interface ApiResponse<T> {
    code: string;
    message: string;
    requestId: string;
    serverTime: string;
    data: T;
}

// Hàm fetch lõi sử dụng Generic <T> để tự động ép kiểu dữ liệu cho phần "data"
const apiFetch = async <T>(endpoint: string, body: any): Promise<ApiResponse<T>> => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    const json = await response.json();

    if (!response.ok) {
        throw new Error(json.message || 'Thao tác thất bại');
    }

    return json as ApiResponse<T>;
};

// Khai báo các service xử lý API cụ thể
export const authService = {
    // API Đăng nhập trả về object có user và accessToken
    login: (credentials: any) => apiFetch<any>('/login', credentials),

    // API Đăng ký trả về thông tin user vừa tạo
    register: (userData: any) => apiFetch<any>('/register', userData),

    // API Quên mật khẩu trả về data: null
    forgotPassword: (email: string) => apiFetch<null>('/forgot-password', { email }),

    // API Xác thực OTP trả về data: null
    verifyOtp: (email: string, otp: string) => apiFetch<null>('/verify-otp-forgot-password', { email, otp }),
};