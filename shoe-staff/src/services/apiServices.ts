// Cấu trúc hàm fetch API mẫu theo yêu cầu
export const fetchData = async <T>(url: string): Promise<T> => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    }
};

export const fetchWithAuth = async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const token = localStorage.getItem('access_token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = '/login'; // Hết hạn token thì về login
        }
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
    }

    return response.json();
};