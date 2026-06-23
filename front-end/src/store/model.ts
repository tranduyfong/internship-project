export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    created_at: string;
    updated_at: string;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
    step: number; // Bước xử lý OTP (1: Nhập Email, 2: Nhập OTP)
    emailForReset: string | null;
}