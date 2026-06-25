import type { FullUserProfile } from '../../types/user';

export interface ProfileState {
    fullProfile: FullUserProfile | null;
    profileLoading: boolean;
}