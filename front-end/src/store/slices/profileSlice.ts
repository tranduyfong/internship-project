import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FullUserProfile } from '../../types/user';

interface ProfileState {
    fullProfile: FullUserProfile | null;
    profileLoading: boolean;
}

const initialState: ProfileState = {
    fullProfile: null,
    profileLoading: false,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfileLoading: (state, action: PayloadAction<boolean>) => { state.profileLoading = action.payload; },
        getProfileSuccess: (state, action: PayloadAction<FullUserProfile>) => { state.fullProfile = action.payload; }
    }
});

export const { setProfileLoading, getProfileSuccess } = profileSlice.actions;
export default profileSlice.reducer;