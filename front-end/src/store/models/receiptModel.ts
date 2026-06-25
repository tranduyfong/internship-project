// src/store/models/receiptModel.ts
import type { Receipt } from '../../types/receipt';

export interface ReceiptState {
    receipts: Receipt[];
    receiptLoading: boolean;
    checkoutLoading: boolean;
}