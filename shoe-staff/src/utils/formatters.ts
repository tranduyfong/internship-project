// Hàm định dạng tiền tệ VNĐ
export const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(amount));
};