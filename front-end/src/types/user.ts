// src/types/user.ts
export interface UserAddress {
    id: number;
    city: string;
    city_code: string | null;       // Cho phép giá trị null đối với dữ liệu cũ
    district: string;
    district_code: string | null;   // Cho phép giá trị null
    village: string;
    ward_code: string | null;       // Cho phép giá trị null
    more: string;
    is_default: number;
}

export interface FullUserProfile {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    created_at: string;
    updated_at: string;
    addresses: UserAddress[];
}