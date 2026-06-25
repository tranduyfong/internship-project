import { createAction } from '@reduxjs/toolkit';

export const loginRequest = createAction<any>('auth/loginRequest');
export const registerRequest = createAction<any>('auth/registerRequest');
export const forgotPasswordRequest = createAction<any>('auth/forgotPasswordRequest');
export const verifyOtpRequest = createAction<any>('auth/verifyOtpRequest');
export const resetPasswordRequest = createAction<any>('auth/resetPasswordRequest');