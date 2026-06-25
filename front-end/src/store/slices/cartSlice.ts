import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../types/cart';

interface CartState {
    cartItems: CartItem[];
    cartLoading: boolean;
}

const initialState: CartState = {
    cartItems: [],
    cartLoading: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartLoading: (state, action: PayloadAction<boolean>) => { state.cartLoading = action.payload; },
        getCartSuccess: (state, action: PayloadAction<CartItem[]>) => { state.cartItems = action.payload; },
    }
});

export const { setCartLoading, getCartSuccess } = cartSlice.actions;
export default cartSlice.reducer;