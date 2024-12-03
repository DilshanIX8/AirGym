import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user-slice";
import chatReducer from "./chat-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer
  },
});

