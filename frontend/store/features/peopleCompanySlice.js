import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import peopleCompanyService from '../../services/peopleCompanyService';

// GET ALL
export const getAllPeopleCompany = createAsyncThunk(
  'peopleCompany/getAll',
  async (_, thunkAPI) => {
    try {
      return await peopleCompanyService.getAllPeopleCompany();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao buscar registros'
      );
    }
  }
);

// GET BY ID
export const getPeopleCompanyById = createAsyncThunk(
  'peopleCompany/getById',
  async (id, thunkAPI) => {
    try {
      return await peopleCompanyService.getPeopleCompanyById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao buscar registro'
      );
    }
  }
);

// CREATE
export const createPeopleCompany = createAsyncThunk(
  'peopleCompany/create',
  async (data, thunkAPI) => {
    try {
      return await peopleCompanyService.createPeopleCompany(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao criar'
      );
    }
  }
);

// UPDATE
export const updatePeopleCompany = createAsyncThunk(
  'peopleCompany/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await peopleCompanyService.updatePeopleCompany(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao atualizar'
      );
    }
  }
);

// DELETE
export const deletePeopleCompany = createAsyncThunk(
  'peopleCompany/delete',
  async (id, thunkAPI) => {
    try {
      await peopleCompanyService.deletePeopleCompany(id);
      return id; // importante pra remover do state
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao deletar'
      );
    }
  }
);

const initialState = {
  list: [],
  item: null,
  isLoading: false,
  isError: false,
  message: ''
};

const peopleCompanySlice = createSlice({
  name: 'peopleCompany',
  initialState,
  reducers: {
    resetPeopleCompanyState: () => initialState
  },
  extraReducers: (builder) => {
    builder

      // GET ALL
      .addCase(getAllPeopleCompany.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPeopleCompany.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(getAllPeopleCompany.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // GET BY ID
      .addCase(getPeopleCompanyById.fulfilled, (state, action) => {
        state.item = action.payload;
      })

      // CREATE
      .addCase(createPeopleCompany.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // UPDATE
      .addCase(updatePeopleCompany.fulfilled, (state, action) => {
        state.list = state.list.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })

      // DELETE
      .addCase(deletePeopleCompany.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (item) => item.id !== action.payload
        );
      });
  }
});

export const { resetPeopleCompanyState } = peopleCompanySlice.actions;
export const peopleCompanyReducer = peopleCompanySlice.reducer;