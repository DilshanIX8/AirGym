import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  selectedConversation: null,
  sender: null,
  search: null,
  conversations: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setSender: (state, action) => {
      state.sender = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
  },
});

export const {
  setMessages,
  setSelectedConversation,
  setSender,
  setSearch,
  setConversations,
} = chatSlice.actions;
export default chatSlice.reducer;
