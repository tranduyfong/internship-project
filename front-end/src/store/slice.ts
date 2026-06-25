// src/store/slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product, ProductDetail } from '../types/product';
import type { CartItem } from '../types/cart';
import type { FullUserProfile } from '../types/user';

interface AppState {
    // Auth State
    user: any | null;
    accessToken: string | null;
    authLoading: boolean;
    authError: string | null;
    step: number;
    emailForReset: string;

    // Product State
    products: Product[];
    productLoading: boolean;
    totalPages: number;
    totalElements: number;
    currentProduct: ProductDetail | null;
    detailLoading: boolean;

    // Cart State
    cartItems: CartItem[];
    cartLoading: boolean;

    // Profile State
    fullProfile: FullUserProfile | null;
    profileLoading: boolean;
}

const initialState: AppState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    accessToken: localStorage.getItem('token') || null,
    authLoading: false,
    authError: null,
    step: 1,
    emailForReset: '',

    products: [],
    productLoading: false,
    totalPages: 1,
    totalElements: 0,
    currentProduct: null,
    detailLoading: false,

    cartItems: [],
    cartLoading: false,

    fullProfile: null,
    profileLoading: false,
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        // Reducers Auth
        setAuthLoading: (state, action: PayloadAction<boolean>) => {
            state.authLoading = action.payload;
        },
        authSuccess: (state, action: PayloadAction<{ user: any; accessToken: string }>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.authError = null;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.accessToken);
        },
        authFailure: (state, action: PayloadAction<string>) => {
            state.authError = action.payload;
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.accessToken = null;
            state.authError = null;
            state.fullProfile = null;
            state.cartItems = [];
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        setStep: (state, action: PayloadAction<number>) => {
            state.step = action.payload;
        },
        setEmailForReset: (state, action: PayloadAction<string>) => {
            state.emailForReset = action.payload;
        },

        // Reducers Sản phẩm
        setProductLoading: (state, action: PayloadAction<boolean>) => {
            state.productLoading = action.payload;
        },
        getProductsSuccess: (state, action: PayloadAction<{ data: Product[]; totalPages: number; totalElements: number }>) => {
            state.products = action.payload.data;
            state.totalPages = action.payload.totalPages;
            state.totalElements = action.payload.totalElements;
        },
        setDetailLoading: (state, action: PayloadAction<boolean>) => {
            state.detailLoading = action.payload;
        },
        getDetailSuccess: (state, action: PayloadAction<ProductDetail>) => {
            state.currentProduct = action.payload;
        },

        // Reducers Giỏ hàng
        setCartLoading: (state, action: PayloadAction<boolean>) => {
            state.cartLoading = action.payload;
        },
        getCartSuccess: (state, action: PayloadAction<CartItem[]>) => {
            state.cartItems = action.payload;
        },

        // Reducers Thông tin cá nhân (Profile)
        setProfileLoading: (state, action: PayloadAction<boolean>) => {
            state.profileLoading = action.payload;
        },
        getProfileSuccess: (state, action: PayloadAction<FullUserProfile>) => {
            state.fullProfile = action.payload;
        }
    },
});

export const {
    setAuthLoading, authSuccess, authFailure, logoutSuccess, setStep, setEmailForReset,
    setProductLoading, getProductsSuccess, setDetailLoading, getDetailSuccess,
    setCartLoading, getCartSuccess,
    setProfileLoading, getProfileSuccess
} = appSlice.actions;

export default appSlice.reducer;