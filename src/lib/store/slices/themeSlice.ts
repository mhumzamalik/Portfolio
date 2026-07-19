import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeState {
  currentTheme: ThemeMode;
}

const initialState: ThemeState = {
  currentTheme: "system",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.currentTheme = action.payload;
    },
  },
});

export const { setThemeMode } = themeSlice.actions;
export default themeSlice.reducer;
