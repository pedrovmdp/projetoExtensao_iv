import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const data = await authService.login(credentials);

      return data;
    } catch (error) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(" ")
        : error.response?.data?.message || "Erro ao realizar login.";

      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const getMe = createAsyncThunk("auth/me", async (_, thunkAPI) => {
  try {
    const data = await authService.getMe();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue("Erro ao obter informações do usuário.");
  }
});

const initialState = {
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  isAuthenticatedLoading: true,
  isError: false,
  message: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // loading
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })

      // sucesso
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;

        state.accessToken = action.payload.accessToken;

        state.user = action.payload.user;
      })

      // erro
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(getMe.pending, (state) => {
        state.isAuthenticatedLoading = true;
        state.isError = false;
        state.message = "";
      })

      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isAuthenticatedLoading = false;
      })

      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isAuthenticatedLoading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
