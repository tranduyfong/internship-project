import { apiClient } from './apiClient';
import type { ApiResponse } from '../types/types';
import type { ChatRoom, ChatMessage } from '../types/types';

export const chatService = {
    getUnreadCount: () => {
        return apiClient<ApiResponse<{ unreadCount: number }>>('/chat/unread-count', { method: 'GET' });
    },
    getAdminRooms: () => {
        return apiClient<ApiResponse<ChatRoom[]>>('/chat/admin/rooms', { method: 'GET' });
    },
    getRoomMessages: (roomId: number, page: number = 1) => {
        return apiClient<ApiResponse<ChatMessage[]>>(`/chat/rooms/${roomId}/messages?page=${page}`, { method: 'GET' });
    },
    markAsRead: (roomId: number) => {
        return apiClient<ApiResponse<null>>(`/chat/rooms/${roomId}/read`, { method: 'PATCH' });
    }
};