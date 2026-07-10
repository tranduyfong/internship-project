import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { authService } from '../../service/auth';
import * as actions from '../actions/authActions';
import * as reducers from '../slices/authSlice';
import { fetchCartRequest } from '../actions/cartActions';
import { fetchProfileRequest } from '../actions/profileActions';

function* handleLogin(action: PayloadAction<any>): Generator<any, void, any> {
    try {
        yield put(reducers.setAuthLoading(true));
        const response = yield call(authService.login, action.payload);
        yield put(reducers.authSuccess({ user: response.data.user, accessToken: response.data.token || response.data.accessToken }));
        toast.success('Đăng nhập thành công!');
        yield put(fetchCartRequest());
        yield put(fetchProfileRequest());
    } catch (error: any) {
        yield put(reducers.authFailure(error.message || 'Đăng nhập thất bại'));
        toast.error(error.message || 'Tài khoản hoặc mật khẩu không đúng!');
    } {
        yield put(reducers.setAuthLoading(false));
    }
}

function* handleRegister(action: PayloadAction<any>): Generator<any, void, any> {
    try {
        yield put(reducers.setAuthLoading(true));
        const response = yield call(authService.register, action.payload);
        toast.success(response.message || 'Đăng ký thành công!');
    } catch (error: any) {
        toast.error(error.message || 'Đăng ký thất bại!');
    } {
        yield put(reducers.setAuthLoading(false));
    }
}

function* handleForgotPassword(action: PayloadAction<any>): Generator<any, void, any> {
    try {
        yield put(reducers.setAuthLoading(true));
        const response = yield call(authService.forgotPassword, action.payload.email);
        toast.success(response.message || 'Mã OTP đã được gửi!');
        yield put(reducers.setEmailForReset(action.payload.email));
        yield put(reducers.setStep(2));
    } catch (error: any) {
        toast.error(error.message || 'Email không tồn tại!');
    } {
        yield put(reducers.setAuthLoading(false));
    }
}

function* handleVerifyOtp(action: ReturnType<typeof actions.verifyOtpRequest>): Generator<any, void, any> {
    try {
        yield put(reducers.setAuthLoading(true));

        // Gọi API kiểm tra OTP
        yield call(authService.verifyOtp, action.payload.email, action.payload.otp);
        yield put(reducers.setStep(3));

    } catch (error: any) {
        toast.error(error.message || 'Mã OTP không hợp lệ hoặc đã hết hạn');
    } finally {
        yield put(reducers.setAuthLoading(false));
    }
}

function* handleResetPassword(action: ReturnType<typeof actions.resetPasswordRequest>): Generator<any, void, any> {
    try {
        yield put(reducers.setAuthLoading(true));

        // Gọi API reset password
        yield call(authService.resetPassword, action.payload);

        toast.success('Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay bây giờ.');

        // Trả UI về form gửi email và đá sang trang đăng nhập
        yield put(reducers.setStep(1));
        window.location.href = '/dang-nhap';
    } catch (error: any) {
        toast.error(error.message || 'Thông tin xác thực không hợp lệ hoặc đã hết hạn');
    } finally {
        yield put(reducers.setAuthLoading(false));
    }
}

export default function* authSaga() {
    yield takeLatest(actions.loginRequest.type, handleLogin);
    yield takeLatest(actions.registerRequest.type, handleRegister);
    yield takeLatest(actions.forgotPasswordRequest.type, handleForgotPassword);
    yield takeLatest(actions.verifyOtpRequest.type, handleVerifyOtp);
    yield takeLatest(actions.resetPasswordRequest.type, handleResetPassword);
}