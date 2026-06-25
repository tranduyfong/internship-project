export interface AuthState {
    user: any | null;
    accessToken: string | null;
    authLoading: boolean;
    authError: string | null;
    step: number;
    emailForReset: string;
}