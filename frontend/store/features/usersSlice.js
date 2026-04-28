import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import usersService from '../../services/userService';

// GET ALL
export const getAllUsers = createAsyncThunk(
  'users/getAll',
  async (_, thunkAPI) => {
    try {
      return await usersService.getAllUsers();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao buscar usuários'
      );
    }
  }
);

// GET BY ID
export const getUserById = createAsyncThunk(
  'users/getById',
  async (id, thunkAPI) => {
    try {
      return await usersService.getUserById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao buscar usuário'
      );
    }
  }
);

// CREATE
export const createUser = createAsyncThunk(
  'users/create',
  async (data, thunkAPI) => {
    try {
      return await usersService.createUser(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao criar usuário'
      );
    }
  }
);

// UPDATE
export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await usersService.updateUser(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao atualizar usuário'
      );
    }
  }
);

// DELETE
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, thunkAPI) => {
    try {
      await usersService.deleteUser(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao deletar usuário'
      );
    }
  }
);

const initialState = {
  list: [],
  selectedUser: null,
  isLoading: false,
  isError: false,
  message: ''
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // GET ALL
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // GET BY ID
      .addCase(getUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })

      // CREATE
      .addCase(createUser.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // UPDATE
      .addCase(updateUser.fulfilled, (state, action) => {
        state.list = state.list.map((user) =>
          user.id === action.payload.id ? action.payload : user
        );
      })

      // DELETE
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (user) => user.id !== action.payload
        );
      });
  }
});

export const { clearSelectedUser } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;