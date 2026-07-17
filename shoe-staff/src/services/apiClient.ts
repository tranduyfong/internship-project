const BASE_URL = 'http://localhost:8000/api';

export const apiClient = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const token = localStorage.getItem('access_token');

    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    if (!isFormData) {
        (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Lỗi HTTP! Trạng thái: ${response.status}`);
    }

    return response.json();
};