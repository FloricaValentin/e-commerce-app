import { createSlice } from "@reduxjs/toolkit";

const isLoggedInFromStorage = sessionStorage.getItem("isLoggedIn") === "true";

const initialState = {
  isLoggedIn: isLoggedInFromStorage,
  userEmail: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.userEmail = action.payload;
      sessionStorage.setItem("isLoggedIn", "true");
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userEmail = "";
      sessionStorage.setItem("isLoggedIn", "false");
    },
  },
});

if (isLoggedInFromStorage) {
  authSlice.actions.login();
}

export const authActions = authSlice.actions;

export default authSlice;
