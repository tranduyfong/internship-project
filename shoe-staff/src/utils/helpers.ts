// Chỉ chứa thuật toán xử lý chuỗi, mảng, số... tuyệt đối không gọi API ở đây
export const capitalizeFirstLetter = (text: string): string => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
};