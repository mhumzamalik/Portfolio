import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  customCursorEnabled: boolean;
  activeModal: string | null;
}

const initialState: UiState = {
  sidebarOpen: false,
  commandPaletteOpen: false,
  customCursorEnabled: true,
  activeModal: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleCommandPalette: (state) => {
      state.commandPaletteOpen = !state.commandPaletteOpen;
    },
    setCommandPaletteOpen: (state, action: PayloadAction<boolean>) => {
      state.commandPaletteOpen = action.payload;
    },
    setCustomCursorEnabled: (state, action: PayloadAction<boolean>) => {
      state.customCursorEnabled = action.payload;
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleCommandPalette,
  setCommandPaletteOpen,
  setCustomCursorEnabled,
  setActiveModal,
} = uiSlice.actions;

export default uiSlice.reducer;
