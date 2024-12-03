import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserValue: (state, action) => {
      state.user = action.payload;
    },
    resetUserValue: (state) => {
      state.user = null;
      state.role = null;
    },
    setRoleValue: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setUserValue, resetUserValue, setRoleValue } = userSlice.actions;
export default userSlice.reducer;
