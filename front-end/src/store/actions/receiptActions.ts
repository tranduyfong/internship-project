import { createAction } from '@reduxjs/toolkit';

export const checkoutRequest = createAction<any>('receipt/checkoutRequest');
export const getMyReceiptsRequest = createAction<{ page: number, limit: number }>('receipt/getMyReceiptsRequest');
export const repayRequest = createAction<number>('receipt/repayRequest');