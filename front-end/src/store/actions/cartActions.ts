import { createAction } from '@reduxjs/toolkit';

export const fetchCartRequest = createAction('cart/fetchCart');
export const addToCartRequest = createAction<{ productId: number; size: number; quantity: number }>('cart/addToCart');
export const updateCartItemRequest = createAction<{ cartId: number; quantity: number }>('cart/updateCartItem');
export const deleteCartItemRequest = createAction<number>('cart/deleteCartItem');