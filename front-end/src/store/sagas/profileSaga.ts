import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { userService } from '../../service/user';
import * as actions from '../actions/profileActions';
import * as reducers from '../slices/profileSlice';
import type { FullUserProfile } from '../../types/user';

function* handleFetchProfile(): Generator<any, void, any> {
    try {
        yield put(reducers.setProfileLoading(true));
        const response: { data: FullUserProfile } = yield call(userService.getProfile);
        yield put(reducers.getProfileSuccess(response.data));
    } catch (e) {
    } {
        yield put(reducers.setProfileLoading(false));
    }
}

function* handleUpdateProfile(action: PayloadAction<{ name: string; phone: string }>): Generator<any, void, any> {
    try {
        yield put(reducers.setProfileLoading(true));
        yield call(userService.updateProfile, action.payload.name, action.payload.phone);
        toast.success('Cập nhật thông tin thành công');
        yield put(actions.fetchProfileRequest());
    } catch (error: any) {
        toast.error('Cập nhật hồ sơ thất bại');
    } {
        yield put(reducers.setProfileLoading(false));
    }
}

function* handleAddAddress(action: PayloadAction<any>): Generator<any, void, any> {
    try {
        yield put(reducers.setProfileLoading(true));
        yield call(userService.addAddress, action.payload);
        toast.success('Thêm địa chỉ mới thành công');
        yield put(actions.fetchProfileRequest());
    } catch (error: any) {
        toast.error('Thêm địa chỉ thất bại');
    } {
        yield put(reducers.setProfileLoading(false));
    }
}

// BỔ SUNG KHỐI UPDATE VÀ DELETE ĐỊA CHỈ CHO HOÀN THIỆN
function* handleUpdateAddress(action: PayloadAction<{ id: number; data: any }>): Generator<any, void, any> {
    try {
        yield put(reducers.setProfileLoading(true));
        yield call(userService.updateAddress, action.payload.id, action.payload.data);
        toast.success('Cập nhật địa chỉ thành công');
        yield put(actions.fetchProfileRequest());
    } catch (error: any) {
        toast.error('Cập nhật địa chỉ thất bại');
    } {
        yield put(reducers.setProfileLoading(false));
    }
}

function* handleDeleteAddress(action: PayloadAction<number>): Generator<any, void, any> {
    try {
        yield put(reducers.setProfileLoading(true));
        yield call(userService.deleteAddress, action.payload);
        toast.success('Xóa địa chỉ thành công');
        yield put(actions.fetchProfileRequest());
    } catch (error: any) {
        toast.error('Xóa địa chỉ thất bại');
    } {
        yield put(reducers.setProfileLoading(false));
    }
}

function* handleSetDefaultAddress(action: PayloadAction<number>): Generator<any, void, any> {
    try {
        yield put(reducers.setProfileLoading(true));
        yield call(userService.setDefaultAddress, action.payload);
        toast.success('Đã đặt làm mặc định');
        yield put(actions.fetchProfileRequest());
    } catch (error: any) {
        toast.error('Lỗi cài đặt mặc định');
    } {
        yield put(reducers.setProfileLoading(false));
    }
}

export default function* profileSaga() {
    yield takeLatest(actions.fetchProfileRequest.type, handleFetchProfile);
    yield takeLatest(actions.updateProfileRequest.type, handleUpdateProfile);
    yield takeLatest(actions.addAddressRequest.type, handleAddAddress);
    yield takeLatest(actions.updateAddressRequest.type, handleUpdateAddress);
    yield takeLatest(actions.deleteAddressRequest.type, handleDeleteAddress);
    yield takeLatest(actions.setDefaultAddressRequest.type, handleSetDefaultAddress);
}