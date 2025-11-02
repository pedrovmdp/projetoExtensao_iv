// 📁 src/store/features/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

/**
 * 🔹 Recupera o usuário salvo no localStorage (mantém sessão ativa ao recarregar)
 */
const savedUser = JSON.parse(localStorage.getItem("user"));

/**
 * 🔸 Estado inicial do slice
 */
const initialState = {
  user: savedUser || null,          // Dados do usuário autenticado
  isAuthenticated: !!savedUser,     // Indica se está logado
};

/**
 * 🔹 Slice de autenticação
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * ✅ Realiza login e salva o usuário no Redux + localStorage
     */
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    /**
     * 🚪 Realiza logout e limpa os dados do Redux + localStorage
     */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
});

// 🔸 Exportações
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
