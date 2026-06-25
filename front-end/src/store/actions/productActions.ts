import { createAction } from '@reduxjs/toolkit';
import type { ProductFilterParams } from '../../service/product';

export const getProductsRequest = createAction<ProductFilterParams>('product/getProductsRequest');
export const getProductDetailRequest = createAction<string | number>('product/getDetailRequest');