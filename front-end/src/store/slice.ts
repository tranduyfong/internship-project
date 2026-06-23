import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from './model';

const savedUser = localStorage.getItem('user');
const savedToken = localStorage.getItem('token');

const initialState: AuthState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    accessToken: savedToken || null,
    loading: false,
    error: null,
    step: 1,
    emailForReset: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        authSuccess: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.error = null;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.accessToken);
        },
        authFailure: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        setStep: (state, action: PayloadAction<number>) => {
            state.step = action.payload;
        },
        setEmailForReset: (state, action: PayloadAction<string | null>) => {
            state.emailForReset = action.payload;
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.accessToken = null;
            state.error = null;
            state.step = 1;
            state.emailForReset = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const { setLoading, authSuccess, authFailure, setStep, setEmailForReset, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;