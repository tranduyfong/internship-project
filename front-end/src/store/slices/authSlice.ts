import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: any | null;
    accessToken: string | null;
    authLoading: boolean;
    authError: string | null;
    step: number;
    emailForReset: string;
}

const initialState: AuthState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    accessToken: localStorage.getItem('token') || null,
    authLoading: false,
    authError: null,
    step: 1,
    emailForReset: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthLoading: (state, action: PayloadAction<boolean>) => { state.authLoading = action.payload; },
        authSuccess: (state, action: PayloadAction<{ user: any; accessToken: string }>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.authError = null;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', action.payload.accessToken);
        },
        authFailure: (state, action: PayloadAction<string>) => { state.authError = action.payload; },
        logoutSuccess: (state) => {
            state.user = null;
            state.accessToken = null;
            state.authError = null;
            state.step = 1;
            state.emailForReset = '';
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        setStep: (state, action: PayloadAction<number>) => { state.step = action.payload; },
        setEmailForReset: (state, action: PayloadAction<string>) => { state.emailForReset = action.payload; },
    }
});

export const { setAuthLoading, authSuccess, authFailure, logoutSuccess, setStep, setEmailForReset } = authSlice.actions;
export default authSlice.reducer;