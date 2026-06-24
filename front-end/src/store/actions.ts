import { createAction } from '@reduxjs/toolkit';
import type { ProductFilterParams } from '../service/product';
import type { CartItem } from '../types/cart';

export const loginRequest = createAction<any>('auth/loginRequest');
export const registerRequest = createAction<any>('auth/registerRequest');
export const forgotPasswordRequest = createAction<string>('auth/forgotPasswordRequest');
export const verifyOtpRequest = createAction<{ email: string; otp: string }>('auth/verifyOtpRequest');

export const getProductsRequest = createAction<ProductFilterParams>('product/getProductsRequest');
export const getProductDetailRequest = createAction<string | number>('product/getDetailRequest');

export const fetchCartRequest = createAction('cart/fetchCart');
export const addToCartRequest = createAction<{ productId: number; size: number; quantity: number }>('cart/addToCart');
export const updateCartItemRequest = createAction<{ cartId: number; quantity: number }>('cart/updateCartItem');
export const deleteCartItemRequest = createAction<number>('cart/deleteCartItem');