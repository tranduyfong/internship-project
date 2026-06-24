// src/types/product.ts
export interface ProductSize {
    size: number;
    quantity: number;
}

export interface Product {
    id: number;
    name_product: string;
    price_product: string;
    descript_product: string;
    brand: string;
    // Cập nhật lại thành mảng chứa các đường dẫn ảnh
    cover_image: string[];
    created_at: string;
    updated_at: string;
    sizes: ProductSize[];
}

export interface ProductPageResponse {
    code: string;
    message: string;
    requestId: string;
    serverTime: string;
    data: Product[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

// Thêm các Interface mới xuống cuối file
export interface ProductDetailImage {
    id: number;
    image_url: string;
}

export interface ProductDetailSize {
    id: number;
    size: number;
    quantity: number;
}

export interface ProductDetail {
    id: number;
    name_product: string;
    price_product: string;
    descript_product: string;
    brand: string;
    created_at: string;
    updated_at: string;
    images: ProductDetailImage[];
    sizes: ProductDetailSize[];
}

export interface ProductDetailResponse {
    code: string;
    message: string;
    data: ProductDetail;
}