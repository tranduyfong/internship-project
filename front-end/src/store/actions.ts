import { createAction } from '@reduxjs/toolkit';

export const loginRequest = createAction<any>('auth/loginRequest');
export const registerRequest = createAction<any>('auth/registerRequest');
export const forgotPasswordRequest = createAction<string>('auth/forgotPasswordRequest');
export const verifyOtpRequest = createAction<{ email: string; otp: string }>('auth/verifyOtpRequest');