import { createAction } from '@reduxjs/toolkit';
import type { ProductFilterParams } from '../service/product';

export const loginRequest = createAction<any>('auth/loginRequest');
export const registerRequest = createAction<any>('auth/registerRequest');
export const forgotPasswordRequest = createAction<string>('auth/forgotPasswordRequest');
export const verifyOtpRequest = createAction<{ email: string; otp: string }>('auth/verifyOtpRequest');

export const getProductsRequest = createAction<ProductFilterParams>('product/getProductsRequest');
export const getProductDetailRequest = createAction<string | number>('product/getDetailRequest');