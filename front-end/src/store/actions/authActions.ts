import { createAction } from '@reduxjs/toolkit';

export const loginRequest = createAction<any>('auth/loginRequest');
export const registerRequest = createAction<any>('auth/registerRequest');
export const forgotPasswordRequest = createAction<any>('auth/forgotPasswordRequest');
export const verifyOtpRequest = createAction<{ email: string, otp: string }>('auth/verifyOtpRequest');
export const resetPasswordRequest = createAction<{ email: string, otp: string, newPassword: string }>('auth/resetPasswordRequest');