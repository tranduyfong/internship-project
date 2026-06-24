import type { ProductDetailResponse, ProductPageResponse } from '../types/product';

const BASE_URL = 'http://localhost:8000/api/products';

export interface ProductFilterParams {
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
    brands?: string;
    sizes?: string;
    minPrice?: number;
    maxPrice?: number;
}

export const productService = {
    getProducts: async (params: ProductFilterParams): Promise<ProductPageResponse> => {
        // Sử dụng URLSearchParams để tự động ghép nối các param có giá trị hợp lệ
        const query = new URLSearchParams();

        if (params.keyword) query.append('keyword', params.keyword);
        if (params.pageNumber !== undefined) query.append('pageNumber', params.pageNumber.toString());
        if (params.pageSize !== undefined) query.append('pageSize', params.pageSize.toString());

        if (params.brands) query.append('brands', params.brands);
        if (params.sizes) query.append('sizes', params.sizes);

        if (params.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
        if (params.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());

        const response = await fetch(`${BASE_URL}/search?${query.toString()}`);

        if (!response.ok) {
            throw new Error('Không thể kết nối đến máy chủ để lấy danh sách sản phẩm');
        }

        return response.json() as Promise<ProductPageResponse>;
    },

    getProductDetail: async (id: string | number): Promise<ProductDetailResponse> => {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error('Không thể tải thông tin sản phẩm');
        return response.json() as Promise<ProductDetailResponse>;
    }
};