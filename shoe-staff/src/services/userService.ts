import { apiClient } from './apiClient';
import type { ApiResponse, Permission } from '../types/types';

export const userService = {
    getMyPermissions: () => {
        return apiClient<ApiResponse<Permission[]>>('/users/me/permissions', { method: 'GET' });
    }
};