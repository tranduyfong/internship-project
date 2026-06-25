import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { cartService } from '../../service/cart';
import * as actions from '../actions/cartActions';
import * as reducers from '../slices/cartSlice';
import type { CartItem, CartResponse } from '../../types/cart';

function* handleFetchCart(): Generator<any, void, any> {
    try {
        yield put(reducers.setCartLoading(true));
        const response: CartResponse<CartItem[]> = yield call(cartService.getCart);
        yield put(reducers.getCartSuccess(response.data || []));
    } catch (e) {
    } {
        yield put(reducers.setCartLoading(false));
    }
}

function* handleAddToCart(action: PayloadAction<{ productId: number; size: number; quantity: number }>): Generator<any, void, any> {
    try {
        const { productId, size, quantity } = action.payload;
        const response = yield call(cartService.addToCart, productId, size, quantity);
        toast.success(response.message || 'Đã thêm vào giỏ hàng');
        yield put(actions.fetchCartRequest());
    } catch (error: any) {
        toast.error(error.message);
    }
}

function* handleUpdateCartItem(action: PayloadAction<{ cartId: number; quantity: number }>): Generator<any, void, any> {
    try {
        const { cartId, quantity } = action.payload;
        yield call(cartService.updateCartItem, cartId, quantity);
        yield put(actions.fetchCartRequest());
    } catch (error: any) {
        toast.error('Cập nhật thất bại');
    }
}

function* handleDeleteCartItem(action: PayloadAction<number>): Generator<any, void, any> {
    try {
        yield call(cartService.deleteCartItem, action.payload);
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
        yield put(actions.fetchCartRequest());
    } catch (error: any) {
        toast.error('Xóa thất bại');
    }
}

export default function* cartSaga() {
    yield takeLatest(actions.fetchCartRequest.type, handleFetchCart);
    yield takeLatest(actions.addToCartRequest.type, handleAddToCart);
    yield takeLatest(actions.updateCartItemRequest.type, handleUpdateCartItem);
    yield takeLatest(actions.deleteCartItemRequest.type, handleDeleteCartItem);
}