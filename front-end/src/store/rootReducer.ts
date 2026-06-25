// src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';

// Import các reducer từ thư mục slices
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import profileReducer from './slices/profileSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    profile: profileReducer,
});

export default rootReducer;