import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface ContactState {
  contacts: ContactMessage[];
  loading: boolean;
  error: string | null;
  activeContactId: string | null;
}

const initialState: ContactState = {
  contacts: [],
  loading: false,
  error: null,
  activeContactId: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setContacts: (state, action: PayloadAction<ContactMessage[]>) => {
      state.contacts = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setActiveContactId: (state, action: PayloadAction<string | null>) => {
      state.activeContactId = action.payload;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const contact = state.contacts.find((c) => c.id === action.payload);
      if (contact) {
        contact.read = true;
      }
    },
    deleteContact: (state, action: PayloadAction<string>) => {
      state.contacts = state.contacts.filter((c) => c.id !== action.payload);
      if (state.activeContactId === action.payload) {
        state.activeContactId = null;
      }
    },
  },
});

export const {
  setContacts,
  setLoading,
  setError,
  setActiveContactId,
  markAsRead,
  deleteContact,
} = contactSlice.actions;

export default contactSlice.reducer;
