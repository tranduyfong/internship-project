export interface LocationItem {
    code: string;
    name: string;
}

// Định nghĩa chung cho Response trả về từ API địa chỉ của bạn
export interface AddressResponse {
    code: string;
    message: string;
    data: LocationItem[];
}