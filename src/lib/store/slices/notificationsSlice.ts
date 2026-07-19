import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface NotificationItem {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

export interface NotificationsState {
  items: NotificationItem[];
}

const initialState: NotificationsState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, "id">>) => {
      const id = typeof crypto !== "undefined" && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 9);
      state.items.push({ ...action.payload, id });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
