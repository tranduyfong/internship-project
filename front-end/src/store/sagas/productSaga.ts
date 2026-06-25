import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { productService, type ProductFilterParams } from '../../service/product';
import * as actions from '../actions/productActions';
import * as reducers from '../slices/productSlice';
import type { ProductPageResponse, ProductDetailResponse } from '../../types/product';

function* handleGetProducts(action: PayloadAction<ProductFilterParams>): Generator<any, void, any> {
    try {
        yield put(reducers.setProductLoading(true));
        const response: ProductPageResponse = yield call(productService.getProducts, action.payload);
        yield put(reducers.getProductsSuccess({ data: response.data, totalPages: response.totalPages, totalElements: response.totalElements }));
    } catch (error: any) {
        toast.error('Lỗi tải sản phẩm');
    } {
        yield put(reducers.setProductLoading(false));
    }
}

function* handleGetProductDetail(action: PayloadAction<string | number>): Generator<any, void, any> {
    try {
        yield put(reducers.setDetailLoading(true));
        const response: ProductDetailResponse = yield call(productService.getProductDetail, action.payload);
        yield put(reducers.getDetailSuccess(response.data));
    } catch (error: any) {
        toast.error('Không thể tải chi tiết sản phẩm');
    } {
        yield put(reducers.setDetailLoading(false));
    }
}

export default function* productSaga() {
    yield takeLatest(actions.getProductsRequest.type, handleGetProducts);
    yield takeLatest(actions.getProductDetailRequest.type, handleGetProductDetail);
}