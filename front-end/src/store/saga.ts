// src/store/saga.ts
import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Import Services
import { productService, type ProductFilterParams } from '../service/product';
import { cartService } from '../service/cart';
import { userService } from '../service/user';

// Import Actions và Reducers từ Slice
import * as actions from './actions';
import * as reducers from './slice';

import type { ProductPageResponse, ProductDetailResponse } from '../types/product';
import type { CartItem, CartResponse } from '../types/cart';
import type { FullUserProfile } from '../types/user';

// ==========================================
// WORKER SAGAS: Xử lý chi tiết từng tác vụ
// ==========================================

// --- 1. SẢN PHẨM ---
function* handleGetProducts(action: PayloadAction<ProductFilterParams>): Generator<any, void, any> {
    try {
        yield put(reducers.setProductLoading(true));
        const response: ProductPageResponse = yield call(productService.getProducts, action.payload);
        yield put(reducers.getProductsSuccess({
            data: response.data,
            totalPages: response.totalPages,
            totalElements: response.totalElements
        }));
    } catch (error: any) {
        toast.error(error.message || 'Lỗi khi tải danh sách sản phẩm');
    } finally {
        yield put(reducers.setProductLoading(false));
    }
}

function* handleGetProductDetail(action: PayloadAction<string | number>): Generator<any, void, any> {
    try {
        yield put(reducers.setDetailLoading(true));
        const response: ProductDetailResponse = yield call(productService.getProductDetail, action.payload);
        yield put(reducers.getDetailSuccess(response.data));
    } catch (error: any) {
        toast.error(error.message || 'Không thể lấy thông tin chi tiết sản phẩm');
    } finally {
        yield put(reducers.setDetailLoading(false));
    }
}

// --- 2. GIỎ HÀNG ---
function* handleFetchCart(): Generator<any, void, any> {
    try {
        yield put(reducers.setCartLoading(true));
        const response: CartResponse<CartItem[]> = yield call(cartService.getCart);
        yield put(reducers.getCartSuccess(response.data || []));
    } catch (error: any) {
        // Bỏ qua lỗi thông báo nếu người dùng chưa đăng nhập hệ thống
    } finally {
        yield put(reducers.setCartLoading(false));
    }
}

function* handleAddToCart(action: PayloadAction<{ productId: number; size: number; quantity: number }>): Generator<any, void, any> {
    try {
        const { productId, size, quantity } = action.payload;
        const response: CartResponse<any> = yield call(cartService.addToCart, productId, size, quantity);
        toast.success(response.message || 'Đã thêm vào giỏ hàng thành công');
        yield put(actions.fetchCartRequest()); // Tải lại giỏ hàng thật để đồng bộ số lượng lên Header
    } catch (error: any) {
        toast.error(error.message || 'Thêm vào giỏ hàng thất bại');
    }
}

function* handleUpdateCartItem(action: PayloadAction<{ cartId: number; quantity: number }>): Generator<any, void, any> {
    try {
        const { cartId, quantity } = action.payload;
        yield call(cartService.updateCartItem, cartId, quantity);
        yield put(actions.fetchCartRequest()); // Tải lại bảng giỏ hàng sau khi tăng/giảm số lượng
    } catch (error: any) {
        toast.error(error.message || 'Cập nhật số lượng thất bại');
    }
}

function* handleDeleteCartItem(action: PayloadAction<number>): Generator<any, void, any> {
    try {
        const response: CartResponse<any> = yield call(cartService.deleteCartItem, action.payload);
        toast.success(response.message || 'Đã xóa sản phẩm khỏi giỏ hàng');
        yield put(actions.fetchCartRequest()); // Làm mới lại bảng dữ liệu
    } catch (error: any) {
        toast.error(error.message || 'Xóa sản phẩm thất bại');
    }
}

// --- 3. THÔNG TIN CÁ NHÂN & ĐỊA CHỈ ---
function* handleFetchProfile(): Generator<any, void, any> {
    try {
        yield put(reducers.setProfileLoading(true));
        const response: { data: FullUserProfile } = yield call(userService.getProfile);
        yield put(reducers.getProfileSuccess(response.data));
    } catch (error: any) {
        toast.error(error.message || 'Không thể lấy thông tin cá nhân');
    } finally {
        yield put(reducers.setProfileLoading(false));
    }
}

function* handleUpdateProfile(action: PayloadAction<{ name: string; phone: string }>): Generator<any, void, any> {
    try {
        yield put(reducers.setProfileLoading(true));
        const { name, phone } = action.payload;
        const response = yield call(userService.updateProfile, name, phone);
        toast.success(response.message || 'Cập nhật thông tin cá nhân thành công');
        yield put(actions.fetchProfileRequest()); // Tự động gọi lại thông tin mới để cập nhật UI
    } catch (error: any) {
        toast.error(error.message || 'Cập nhật thông tin thất bại');
    } finally {
        yield put(reducers.setProfileLoading(false));
    }
}

function* handleAddAddress(action: PayloadAction<any>): Generator<any, void, any> {
    try {
        yield put(reducers.setProfileLoading(true));
        const response = yield call(userService.addAddress, action.payload);
        toast.success(response.message || 'Thêm địa chỉ nhận hàng mới thành công');
        yield put(actions.fetchProfileRequest()); // Tải lại sổ địa chỉ mới gồm cả mục mặc định vừa thêm
    } catch (error: any) {
        toast.error(error.message || 'Thêm địa chỉ mới thất bại');
    } finally {
        yield put(reducers.setProfileLoading(false));
    }
}

function* handleSetDefaultAddress(action: PayloadAction<number>): Generator<any, void, any> {
    try {
        yield put(reducers.setProfileLoading(true));
        const response = yield call(userService.setDefaultAddress, action.payload);
        toast.success(response.message || 'Đã thay đổi địa chỉ giao hàng mặc định');
        yield put(actions.fetchProfileRequest()); // Làm mới danh sách gắn Tag "Mặc định" mới
    } catch (error: any) {
        toast.error(error.message || 'Thiết lập địa chỉ mặc định thất bại');
    } finally {
        yield put(reducers.setProfileLoading(false));
    }
}

function* handleUpdateAddress(action: PayloadAction<{ id: number; data: any }>): Generator<any, void, any> {
    try {
        yield put(reducers.setProfileLoading(true));
        const response = yield call(userService.updateAddress, action.payload.id, action.payload.data);
        toast.success(response.message || 'Cập nhật địa chỉ thành công');
        yield put(actions.fetchProfileRequest()); // Load lại sổ địa chỉ
    } catch (error: any) {
        toast.error(error.message || 'Cập nhật địa chỉ thất bại');
    } finally {
        yield put(reducers.setProfileLoading(false));
    }
}

function* handleDeleteAddress(action: PayloadAction<number>): Generator<any, void, any> {
    try {
        yield put(reducers.setProfileLoading(true));
        const response = yield call(userService.deleteAddress, action.payload);
        toast.success(response.message || 'Xóa địa chỉ thành công');
        yield put(actions.fetchProfileRequest());
    } catch (error: any) {
        toast.error(error.message || 'Xóa địa chỉ thất bại');
    } finally {
        yield put(reducers.setProfileLoading(false));
    }
}

// ==========================================
// WATCHER SAGA: Theo dõi các luồng sự kiện
// ==========================================
export default function* authSaga(): Generator<any, void, any> {
    // Lắng nghe sản phẩm
    yield takeLatest(actions.getProductsRequest.type, handleGetProducts);
    yield takeLatest(actions.getProductDetailRequest.type, handleGetProductDetail);

    // Lắng nghe giỏ hàng
    yield takeLatest(actions.fetchCartRequest.type, handleFetchCart);
    yield takeLatest(actions.addToCartRequest.type, handleAddToCart);
    yield takeLatest(actions.updateCartItemRequest.type, handleUpdateCartItem);
    yield takeLatest(actions.deleteCartItemRequest.type, handleDeleteCartItem);

    // Lắng nghe hồ sơ cá nhân
    yield takeLatest(actions.fetchProfileRequest.type, handleFetchProfile);
    yield takeLatest(actions.updateProfileRequest.type, handleUpdateProfile);
    yield takeLatest(actions.addAddressRequest.type, handleAddAddress);
    yield takeLatest(actions.setDefaultAddressRequest.type, handleSetDefaultAddress);
    yield takeLatest(actions.updateAddressRequest.type, handleUpdateAddress);
    yield takeLatest(actions.deleteAddressRequest.type, handleDeleteAddress);
}