import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FullUserProfile } from '../../types/user';

interface ProfileState {
    fullProfile: FullUserProfile | null;
    profileLoading: boolean;
    changePasswordLoading: boolean;
}

const initialState: ProfileState = {
    fullProfile: null,
    profileLoading: false,
    changePasswordLoading: false,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfileLoading: (state, action: PayloadAction<boolean>) => { state.profileLoading = action.payload; },
        getProfileSuccess: (state, action: PayloadAction<FullUserProfile>) => { state.fullProfile = action.payload; },
        setChangePasswordLoading: (state, action) => { state.changePasswordLoading = action.payload; },
    }
});

export const { setProfileLoading, getProfileSuccess, setChangePasswordLoading } = profileSlice.actions;
export default profileSlice.reducer;