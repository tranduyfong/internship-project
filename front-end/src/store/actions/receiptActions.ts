import { createAction } from '@reduxjs/toolkit';

export const checkoutRequest = createAction<any>('receipt/checkoutRequest');
export const getMyReceiptsRequest = createAction('receipt/getMyReceipts');
export const repayRequest = createAction<number>('receipt/repayRequest');