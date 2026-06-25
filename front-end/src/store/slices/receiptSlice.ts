import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// Đổi model tương ứng thành receiptModel (bạn tự đổi tên file model nhé)
import type { ReceiptState } from '../models/receiptModel';
import type { Receipt } from '../../types/receipt';

const initialState: ReceiptState = {
    receipts: [],
    receiptLoading: false,
    checkoutLoading: false,
};

const receiptSlice = createSlice({
    name: 'receipt',
    initialState,
    reducers: {
        setCheckoutLoading: (state, action: PayloadAction<boolean>) => { state.checkoutLoading = action.payload; },
        setReceiptLoading: (state, action: PayloadAction<boolean>) => { state.receiptLoading = action.payload; },
        getReceiptsSuccess: (state, action: PayloadAction<Receipt[]>) => { state.receipts = action.payload; },
    }
});

export const { setCheckoutLoading, setReceiptLoading, getReceiptsSuccess } = receiptSlice.actions;
export default receiptSlice.reducer;