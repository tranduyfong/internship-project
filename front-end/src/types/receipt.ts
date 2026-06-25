export interface ReceiptItem {
    id: number;
    receipt_id: number;
    product_id: number;
    name_product: string;      // Tên sản phẩm
    img_src: string;           // Ảnh sản phẩm
    price_at_time: string;     // Giá tại thời điểm mua (chuỗi)
    size: number;
    quantity: number;
}

export interface Receipt {
    id: number;
    user_id: number;
    order_code: string;        // Mã đơn hàng
    total_amount: string;      // Tổng tiền (chuỗi)
    payment_method: string;    // COD / VNPAY
    payment_status: string;    // Pending...
    order_status: string;      // processing...
    shipping_full_name: string;
    shipping_phone: string;
    shipping_address: string;
    created_at: string;
    updated_at: string;
    items: ReceiptItem[];
    paymentUrl?: string;       // (Dự phòng cho API lấy link VNPay)
}