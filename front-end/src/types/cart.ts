// src/types/cart.ts
export interface CartItem {
    cart_id: number;
    size: number;
    quantity: number;
    product_id: number;
    name_product: string;
    price_product: string;
    cover_image: string;
}

export interface CartResponse<T> {
    code: string;
    message: string;
    requestId: string;
    serverTime: string;
    data: T;
}