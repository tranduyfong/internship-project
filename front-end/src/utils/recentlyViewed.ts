// Định nghĩa cấu trúc dữ liệu của một Sản phẩm thu gọn
export interface ViewedProduct {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    slug: string; // Dùng để tạo link chuyển hướng
}

const STORAGE_KEY = 'recently_viewed_products';
const MAX_ITEMS = 10;

// Nhận vào object product với bất kỳ kiểu dữ liệu nào khớp với API của bạn
export const addProductToHistory = (product: any) => {
    const historyData = localStorage.getItem(STORAGE_KEY);
    let history: any[] = historyData ? JSON.parse(historyData) : [];

    // Lọc bỏ sản phẩm nếu đã tồn tại (Dùng trường 'id' theo chuẩn JSON API của bạn)
    history = history.filter(item => item.id !== product.id);

    // Đưa lên đầu mảng
    history.unshift(product);

    if (history.length > MAX_ITEMS) {
        history = history.slice(0, MAX_ITEMS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    window.dispatchEvent(new Event('recentlyViewedProductsUpdated'));
};

export const getViewedProducts = (): any[] => {
    const historyData = localStorage.getItem(STORAGE_KEY);
    return historyData ? JSON.parse(historyData) : [];
};