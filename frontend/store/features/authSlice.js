import { createSlice } from "@reduxjs/toolkit";

// 🔹 Tenta recuperar o usuário salvo no localStorage
const savedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: savedUser || null,              // guarda os dados do usuário logado
  isAuthenticated: !!savedUser,         // indica se já está logado
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload)); // salva no localStorage
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user"); // remove do localStorage
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
