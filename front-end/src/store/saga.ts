import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import { authService, type ApiResponse } from '../service/auth';
import { productService } from '../service/product'; // Import service sản phẩm
import type { ProductDetailResponse, ProductPageResponse } from '../types/product';

import {
    loginRequest, registerRequest, forgotPasswordRequest, verifyOtpRequest,
    getProductsRequest, // Import Action mới
    getProductDetailRequest,
    fetchCartRequest,
    addToCartRequest,
    updateCartItemRequest,
    deleteCartItemRequest
} from './actions';
import {
    setLoading, authSuccess, authFailure, setStep, setEmailForReset,
    setProductLoading, getProductsSuccess, // Import Reducers mới
    setDetailLoading,
    getDetailSuccess,
    setCartLoading,
    getCartSuccess
} from './slice';

import type { ProductFilterParams } from '../service/product';
import { cartService } from '../service/cart';

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

function* handleGetProducts(action: PayloadAction<ProductFilterParams>): Generator<any, void, any> {
    try {
        yield put(setProductLoading(true));
        // Truyền toàn bộ payload vào service
        const response: ProductPageResponse = yield call(productService.getProducts, action.payload);
        // Đẩy nguyên response vào Redux để cập nhật luôn cả mảng sản phẩm + phân trang
        yield put(getProductsSuccess(response));
    } catch (error: any) {
        toast.error(error.message || 'Lỗi khi tải danh sách sản phẩm');
    } finally {
        yield put(setProductLoading(false));
    }
}

function* handleGetProductDetail(action: PayloadAction<string | number>): Generator<any, void, any> {
    try {
        yield put(setDetailLoading(true));
        const response: ProductDetailResponse = yield call(productService.getProductDetail, action.payload);
        yield put(getDetailSuccess(response.data));
    } catch (error: any) {
        toast.error(error.message || 'Lỗi khi tải chi tiết sản phẩm');
    } finally {
        yield put(setDetailLoading(false));
    }
}

function* handleFetchCart(): Generator<any, void, any> {
    try {
        yield put(setCartLoading(true));
        const response = yield call(cartService.getCart);
        yield put(getCartSuccess(response.data || []));
    } catch (error: any) {
        // Không ném toast lỗi nếu chưa đăng nhập để tránh phiền
    } finally {
        yield put(setCartLoading(false));
    }
}

function* handleAddToCart(action: PayloadAction<{ productId: number; size: number; quantity: number }>): Generator<any, void, any> {
    try {
        const { productId, size, quantity } = action.payload;
        const response = yield call(cartService.addToCart, productId, size, quantity);
        toast.success(response.message || 'Đã thêm vào giỏ hàng');
        yield put(fetchCartRequest()); // Tải lại giỏ hàng
    } catch (error: any) {
        toast.error(error.message);
    }
}

function* handleUpdateCartItem(action: PayloadAction<{ cartId: number; quantity: number }>): Generator<any, void, any> {
    try {
        const { cartId, quantity } = action.payload;
        yield call(cartService.updateCartItem, cartId, quantity);
        yield put(fetchCartRequest());
    } catch (error: any) {
        toast.error(error.message);
    }
}

function* handleDeleteCartItem(action: PayloadAction<number>): Generator<any, void, any> {
    try {
        const response = yield call(cartService.deleteCartItem, action.payload);
        toast.success(response.message || 'Đã xóa sản phẩm');
        yield put(fetchCartRequest());
    } catch (error: any) {
        toast.error(error.message);
    }
}

export default function* authSaga(): Generator<any, void, any> {
    yield takeLatest(loginRequest.type, handleLogin);
    yield takeLatest(registerRequest.type, handleRegister);
    yield takeLatest(forgotPasswordRequest.type, handleForgotPassword);
    yield takeLatest(verifyOtpRequest.type, handleVerifyOtp);

    yield takeLatest(getProductsRequest.type, handleGetProducts);
    yield takeLatest(getProductDetailRequest.type, handleGetProductDetail);

    yield takeLatest(fetchCartRequest.type, handleFetchCart);
    yield takeLatest(addToCartRequest.type, handleAddToCart);
    yield takeLatest(updateCartItemRequest.type, handleUpdateCartItem);
    yield takeLatest(deleteCartItemRequest.type, handleDeleteCartItem);
}