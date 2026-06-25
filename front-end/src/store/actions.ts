// src/store/actions.ts
import { createAction } from '@reduxjs/toolkit';
import type { ProductFilterParams } from '../service/product';

// --- PHÂN HỆ: XÁC THỰC (AUTH) ---
export const loginRequest = createAction<any>('auth/loginRequest');
export const registerRequest = createAction<any>('auth/registerRequest');
export const forgotPasswordRequest = createAction<any>('auth/forgotPasswordRequest');

export const verifyOtpRequest = createAction<any>('auth/verifyOtpRequest');
export const resetPasswordRequest = createAction<any>('auth/resetPasswordRequest');

// --- PHÂN HỆ: SẢN PHẨM (PRODUCT) ---
export const getProductsRequest = createAction<ProductFilterParams>('product/getProductsRequest');
export const getProductDetailRequest = createAction<string | number>('product/getDetailRequest');

// --- PHÂN HỆ: GIỎ HÀNG (CART) ---
export const fetchCartRequest = createAction('cart/fetchCart');
export const addToCartRequest = createAction<{ productId: number; size: number; quantity: number }>('cart/addToCart');
export const updateCartItemRequest = createAction<{ cartId: number; quantity: number }>('cart/updateCartItem');
export const deleteCartItemRequest = createAction<number>('cart/deleteCartItem');

// --- PHÂN HỆ: THÔNG TIN CÁ NHÂN & ĐỊA CHỈ (USER PROFILE) ---
export const fetchProfileRequest = createAction('user/fetchProfile');
export const updateProfileRequest = createAction<{ name: string; phone: string }>('user/updateProfile');
export const addAddressRequest = createAction<{ city: string; district: string; village: string; more: string; is_default: boolean }>('user/addAddress');
export const setDefaultAddressRequest = createAction<number>('user/setDefaultAddress');
export const updateAddressRequest = createAction<{ id: number; data: any }>('user/updateAddress');
export const deleteAddressRequest = createAction<number>('user/deleteAddress');