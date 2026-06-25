import type { Product, ProductDetail } from '../../types/product';

export interface ProductState {
    products: Product[];
    productLoading: boolean;
    totalPages: number;
    totalElements: number;
    currentProduct: ProductDetail | null;
    detailLoading: boolean;
}