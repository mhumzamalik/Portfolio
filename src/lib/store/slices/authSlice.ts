import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  fullName?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  twoFactorVerified: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  twoFactorVerified: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.twoFactorVerified = false;
    },
    setTwoFactorVerified: (state, action: PayloadAction<boolean>) => {
      state.twoFactorVerified = action.payload;
    },
  },
});

export const { setUser, clearUser, setTwoFactorVerified } = authSlice.actions;
export default authSlice.reducer;
