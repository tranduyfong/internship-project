import type { AddressResponse } from '../types/address';

const BASE_URL = 'http://localhost:8000/api/addresses';

export const addressService = {
    getProvinces: async (): Promise<AddressResponse> => {
        const res = await fetch(`${BASE_URL}/provinces`);
        return res.json();
    },
    getDistricts: async (provinceCode: string): Promise<AddressResponse> => {
        const res = await fetch(`${BASE_URL}/provinces/${provinceCode}/districts`);
        return res.json();
    },
    getWards: async (districtCode: string): Promise<AddressResponse> => {
        const res = await fetch(`${BASE_URL}/districts/${districtCode}/wards`);
        return res.json();
    }
};