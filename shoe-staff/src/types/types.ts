export interface Permission {
    id: number;
    code: string;
    description: string;
}

export interface Product {
    id: number;
    name_product: string;
    price_product: string;
    brand: string;
    import_price: string;
    status: string;
    cover_image: string[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
}

export interface LoginData {
    user: User;
    accessToken: string;
}

// Chuẩn hóa định dạng trả về của API
export interface ApiResponse<T> {
    code: string;
    message: string;
    data: T;
    requestId?: string;
    serverTime?: string;
    pageNumber?: number;
    pageSize?: number;
    totalElements?: number;
    totalPages?: number;
}

export interface ProductImage {
    id: number;
    image_url: string;
}

export interface ProductSize {
    id: number;
    size: number;
    quantity: number;
}

export interface ProductDetail {
    id: number;
    name_product: string;
    price_product: string;
    import_price: string;
    descript_product: string;
    brand: string;
    status: string;
    images: ProductImage[];
    sizes: ProductSize[];
}