import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Import authService từ tầng service
import { authService } from '../service/auth';
import type { ApiResponse } from '../service/auth';

import {
    loginRequest, registerRequest, forgotPasswordRequest, verifyOtpRequest
} from './actions';
import {
    setLoading, authSuccess, authFailure, setStep, setEmailForReset
} from './slice';

function* handleLogin(action: PayloadAction<any>): Generator<any, void, any> {
    try {
        yield put(setLoading(true));
        // Gọi API thông qua tầng service
        const response: ApiResponse<any> = yield call(authService.login, action.payload);

        // Khớp chuẩn xác theo cấu trúc bọc response.data
        yield put(authSuccess({
            user: response.data.user,
            accessToken: response.data.accessToken
        }));
        toast.success(response.message || 'Đăng nhập thành công!');
        window.location.href = '/';
    } catch (error: any) {
        yield put(authFailure(error.message));
        toast.error(error.message);
    } finally {
        yield put(setLoading(false));
    }
}

function* handleRegister(action: PayloadAction<any>): Generator<any, void, any> {
    try {
        yield put(setLoading(true));
        const response: ApiResponse<any> = yield call(authService.register, action.payload);
        toast.success(response.message || 'Đăng ký thành công!');
        window.location.href = '/dang-nhap';
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        yield put(setLoading(false));
    }
}

function* handleForgotPassword(action: PayloadAction<string>): Generator<any, void, any> {
    try {
        yield put(setLoading(true));
        const response: ApiResponse<null> = yield call(authService.forgotPassword, action.payload);
        toast.success(response.message || 'Mã OTP đã được gửi đến email của bạn');
        yield put(setEmailForReset(action.payload));
        yield put(setStep(2));
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        yield put(setLoading(false));
    }
}

function* handleVerifyOtp(action: PayloadAction<{ email: string; otp: string }>): Generator<any, void, any> {
    try {
        yield put(setLoading(true));
        const response: ApiResponse<null> = yield call(authService.verifyOtp, action.payload.email, action.payload.otp);
        toast.success(response.message || 'Xác thực OTP thành công');
        window.location.href = '/dang-nhap';
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        yield put(setLoading(false));
    }
}

export default function* authSaga(): Generator<any, void, any> {
    yield takeLatest(loginRequest.type, handleLogin);
    yield takeLatest(registerRequest.type, handleRegister);
    yield takeLatest(forgotPasswordRequest.type, handleForgotPassword);
    yield takeLatest(verifyOtpRequest.type, handleVerifyOtp);
}