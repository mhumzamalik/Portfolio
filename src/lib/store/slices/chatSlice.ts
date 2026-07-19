import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  id: string;
  conversationId: string;
  sender: "Visitor" | "Admin";
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  visitorId: string;
  visitorName: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  messages: [],
  activeConversationId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    updateConversationLastMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: Message }>
    ) => {
      const { conversationId, message } = action.payload;
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) {
        conv.updatedAt = message.createdAt;
        if (conv.messages) {
          conv.messages = [message];
        }
      }
      // Re-sort conversations by updatedAt desc
      state.conversations.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      // Avoid duplicate messages
      if (!state.messages.some((msg) => msg.id === action.payload.id)) {
        state.messages.push(action.payload);
      }
    },
    setActiveConversationId: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    closeConversationInState: (state, action: PayloadAction<string>) => {
      const conv = state.conversations.find((c) => c.id === action.payload);
      if (conv) {
        conv.status = "Closed";
      }
    },
  },
});

export const {
  setConversations,
  updateConversationLastMessage,
  setMessages,
  addMessage,
  setActiveConversationId,
  setLoading,
  setError,
  closeConversationInState,
} = chatSlice.actions;

export default chatSlice.reducer;
