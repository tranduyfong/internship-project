// src/store/sagas/receiptSaga.ts
import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { receiptService } from '../../service/receipt';
import * as actions from '../actions/receiptActions';
import * as reducers from '../slices/receiptSlice';

function* handleCheckout(action: PayloadAction<any>): Generator<any, void, any> {
    try {
        yield put(reducers.setCheckoutLoading(true));

        // Gọi API lên BE
        const response = yield call(receiptService.checkout, action.payload);

        // Dựa vào paymentMethod bạn truyền lên để rẽ nhánh UI
        if (action.payload.paymentMethod === 'VNPAY' && response.data?.redirectUrl) {
            // Chuyển hướng người dùng thẳng sang link VNPay
            window.location.href = response.data.redirectUrl;
        } else {
            // COD: Xóa giỏ hàng Redux (nếu cần) và đá về trang Lịch sử đơn hàng
            toast.success('Đặt hàng thành công!');
            window.location.href = '/kiem-tra-don-hang';
        }
    } catch (error: any) {
        toast.error(error.message || 'Thanh toán thất bại, vui lòng thử lại!');
    } finally {
        yield put(reducers.setCheckoutLoading(false));
    }
}

function* handleGetMyReceipts(): Generator<any, void, any> {
    try {
        yield put(reducers.setReceiptLoading(true));
        const response = yield call(receiptService.getMyReceipts);
        yield put(reducers.getReceiptsSuccess(response.data || []));
    } catch (error: any) {
        toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
        yield put(reducers.setReceiptLoading(false));
    }
}

function* handleRepay(action: PayloadAction<number>): Generator<any, void, any> {
    try {
        // Tái sử dụng state loading của checkout cho tiện
        yield put(reducers.setCheckoutLoading(true));

        const response = yield call(receiptService.repay, action.payload);

        if (response.data?.redirectUrl) {
            // Chuyển hướng thẳng sang VNPay
            window.location.href = response.data.redirectUrl;
        } else {
            toast.error('Không tìm thấy link thanh toán VNPay');
        }
    } catch (error: any) {
        toast.error(error.message || 'Không thể tạo link thanh toán lại');
    } finally {
        yield put(reducers.setCheckoutLoading(false));
    }
}

export default function* receiptSaga() {
    yield takeLatest(actions.checkoutRequest.type, handleCheckout);
    yield takeLatest(actions.getMyReceiptsRequest.type, handleGetMyReceipts);
    yield takeLatest(actions.repayRequest.type, handleRepay);
}