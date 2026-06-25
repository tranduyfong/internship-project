import { call, put, takeLatest, delay } from 'redux-saga/effects';
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

function* handleVerifyOtp(action: PayloadAction<any>): Generator<any, void, any> {
    try {
        yield put(reducers.setAuthLoading(true));
        yield call(authService.verifyOtp, action.payload.email, action.payload.otp);
        toast.success('Xác thực OTP thành công!');
        yield put(reducers.setStep(3));
    } catch (error: any) {
        toast.error(error.message || 'Mã OTP sai hoặc hết hạn!');
    } {
        yield put(reducers.setAuthLoading(false));
    }
}

function* handleResetPassword(action: PayloadAction<any>): Generator<any, void, any> {
    try {
        yield put(reducers.setAuthLoading(true));

        // --- ĐOẠN CODE GIẢ LẬP TẠM THỜI (MOCK API) ---
        // Tạm thời comment/xóa dòng gọi API thật để không bị lỗi:
        // const response = yield call(authService.resetPassword, action.payload.email, action.payload.password);

        // Giả lập thời gian chờ server phản hồi là 1.5 giây (1500ms)
        yield delay(1500);

        // Báo thành công và chuyển thẳng UI về bước 1
        toast.success('Đổi mật khẩu thành công! (Đang chạy giả lập)');
        yield put(reducers.setStep(1));
        // ---------------------------------------------

    } catch (error: any) {
        toast.error(error.message || 'Đặt lại mật khẩu thất bại.');
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