import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ReceiptState } from '../models/receiptModel';
import type { Receipt } from '../../types/receipt';

const initialState: ReceiptState = {
    receipts: [],
    receiptLoading: false,
    checkoutLoading: false,
    totalPages: 1,
};

const receiptSlice = createSlice({
    name: 'receipt',
    initialState,
    reducers: {
        setCheckoutLoading: (state, action: PayloadAction<boolean>) => { state.checkoutLoading = action.payload; },
        setReceiptLoading: (state, action: PayloadAction<boolean>) => { state.receiptLoading = action.payload; },
        getMyReceiptsSuccess: (state, action) => {
            state.receiptLoading = false; state.receipts = action.payload.receipts; state.totalPages = action.payload.pagination.totalPage;
        },
    }
});

export const { setCheckoutLoading, setReceiptLoading, getMyReceiptsSuccess } = receiptSlice.actions;
export default receiptSlice.reducer;