import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const getInitialState = () => {
  const token = localStorage.getItem("token");
  let role = null;
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
      userId = decoded.id;
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  return {
    token: token || null,
    role: role,
    userId:userId,
    isAuthenticated: !!token,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),

  reducers: {
    login: (state, action) => {
      const token = action.payload;
      state.token = token;
localStorage.setItem("token",token)
      try {
        const decoded = jwtDecode(token);
        state.role = decoded.role;
        state.userId=decoded.id;
      } catch (err) {
        console.error("Token decode failed:", err);
      }

      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
