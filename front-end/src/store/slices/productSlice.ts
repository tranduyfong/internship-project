import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductDetail } from '../../types/product';

interface ProductState {
    products: Product[];
    productLoading: boolean;
    totalPages: number;
    totalElements: number;
    currentProduct: ProductDetail | null;
    detailLoading: boolean;
}

const initialState: ProductState = {
    products: [],
    productLoading: false,
    totalPages: 1,
    totalElements: 0,
    currentProduct: null,
    detailLoading: false,
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProductLoading: (state, action: PayloadAction<boolean>) => { state.productLoading = action.payload; },
        getProductsSuccess: (state, action: PayloadAction<{ data: Product[]; totalPages: number; totalElements: number }>) => {
            state.products = action.payload.data;
            state.totalPages = action.payload.totalPages;
            state.totalElements = action.payload.totalElements;
        },
        setDetailLoading: (state, action: PayloadAction<boolean>) => { state.detailLoading = action.payload; },
        getDetailSuccess: (state, action: PayloadAction<ProductDetail>) => { state.currentProduct = action.payload; },
    }
});

export const { setProductLoading, getProductsSuccess, setDetailLoading, getDetailSuccess } = productSlice.actions;
export default productSlice.reducer;