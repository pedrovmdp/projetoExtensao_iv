import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import rolesService from '../../services/roleService';

// GET ALL
export const getAllRoles = createAsyncThunk(
  'roles/getAll',
  async (_, thunkAPI) => {
    try {
      return await rolesService.getAllRoles();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao buscar roles'
      );
    }
  }
);

// GET BY ID
export const getRoleById = createAsyncThunk(
  'roles/getById',
  async (id, thunkAPI) => {
    try {
      return await rolesService.getRoleById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao buscar role'
      );
    }
  }
);

// CREATE
export const createRole = createAsyncThunk(
  'roles/create',
  async (data, thunkAPI) => {
    try {
      return await rolesService.createRole(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao criar role'
      );
    }
  }
);

// UPDATE
export const updateRole = createAsyncThunk(
  'roles/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await rolesService.updateRole(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao atualizar role'
      );
    }
  }
);

// DELETE
export const deleteRole = createAsyncThunk(
  'roles/delete',
  async (id, thunkAPI) => {
    try {
      await rolesService.deleteRole(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao deletar role'
      );
    }
  }
);

const initialState = {
  list: [],
  selectedRole: null,
  isLoading: false,
  isError: false,
  message: ''
};

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearSelectedRole: (state) => {
      state.selectedRole = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // GET ALL
      .addCase(getAllRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // GET BY ID
      .addCase(getRoleById.fulfilled, (state, action) => {
        state.selectedRole = action.payload;
      })

      // CREATE
      .addCase(createRole.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // UPDATE
      .addCase(updateRole.fulfilled, (state, action) => {
        state.list = state.list.map((role) =>
          role.id === action.payload.id ? action.payload : role
        );
      })

      // DELETE
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (role) => role.id !== action.payload
        );
      });
  }
});

export const { clearSelectedRole } = rolesSlice.actions;
export const rolesReducer = rolesSlice.reducer;