import { apiClient } from './apiClient';
import type { ApiResponse, LoginData } from '../types/types';

export const authService = {
    login: (email: string, password: string) => {
        return apiClient<ApiResponse<LoginData>>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }
};