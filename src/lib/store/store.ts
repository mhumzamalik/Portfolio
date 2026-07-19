import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import themeReducer from "./slices/themeSlice";
import notificationsReducer from "./slices/notificationsSlice";
import contactReducer from "./slices/contactSlice";
import chatReducer from "./slices/chatSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
      theme: themeReducer,
      notifications: notificationsReducer,
      contact: contactReducer,
      chat: chatReducer,
    },
    // Adding devTools configuration if needed
    devTools: process.env.NODE_ENV !== "production",
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
