import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from './model';
import type { Product, ProductDetail, ProductPageResponse } from '../types/product';

const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');

// Định nghĩa cấu trúc State mở rộng bao gồm cả sản phẩm
interface ExtendedState extends AuthState {
    products: Product[];
    productLoading: boolean;
    totalPages: number;
    totalElements: number;

    currentProduct: ProductDetail | null;
    detailLoading: boolean;
    cartCount: number;
}

const initialState: ExtendedState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    accessToken: savedToken || null,
    loading: false,
    error: null,
    step: 1,
    emailForReset: null,
    // State sản phẩm khởi tạo
    products: [],
    productLoading: false,
    totalPages: 1,
    totalElements: 0,
    currentProduct: null,
    detailLoading: false,
    cartCount: 0,
};

const authSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        // Các Reducers cũ của Auth giữ nguyên...
        setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
        authSuccess: (state, action: PayloadAction<{ user: any; accessToken: string }>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.error = null;

            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.accessToken);
        },
        authFailure: (state, action: PayloadAction<string>) => { state.error = action.payload; },
        setStep: (state, action: PayloadAction<number>) => { state.step = action.payload; },
        setEmailForReset: (state, action: PayloadAction<string | null>) => { state.emailForReset = action.payload; },
        logoutSuccess: (state) => {
            state.user = null;
            state.accessToken = null;
        },

        // Các Reducers xử lý sản phẩm mới
        setProductLoading: (state, action: PayloadAction<boolean>) => {
            state.productLoading = action.payload;
        },
        getProductsSuccess: (state, action: PayloadAction<ProductPageResponse>) => {
            state.products = action.payload.data;
            state.totalPages = action.payload.totalPages;
            state.totalElements = action.payload.totalElements;
        },

        // Reducers mới cho Product Detail
        setDetailLoading: (state, action: PayloadAction<boolean>) => { state.detailLoading = action.payload; },
        getDetailSuccess: (state, action: PayloadAction<ProductDetail>) => { state.currentProduct = action.payload; },

        // Reducer mới cho Fake Giỏ Hàng
        addToCartEffect: (state, action: PayloadAction<number>) => {
            state.cartCount += action.payload;
        }
    },
});

export const {
    setLoading, authSuccess, authFailure, setStep, setEmailForReset, logoutSuccess,
    setProductLoading, getProductsSuccess, setDetailLoading, getDetailSuccess, addToCartEffect
} = authSlice.actions;
export default authSlice.reducer;