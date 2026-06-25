import type { CartItem } from '../../types/cart';

export interface CartState {
    cartItems: CartItem[];
    cartLoading: boolean;
}