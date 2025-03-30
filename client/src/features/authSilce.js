import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null,  // Added role to initial state
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.role = action.payload.user.role; 
    },
    userLoggedout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null; // Reset role on logout
    },
  },
});

export const { userLoggedIn, userLoggedout } = authSlice.actions;
export default authSlice.reducer;
