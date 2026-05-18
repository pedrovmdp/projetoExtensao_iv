import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import monitoringSheetsService from '../../services/monitoringSheetService';
 
// GET ALL
export const getAllMonitoringSheets = createAsyncThunk(
  'monitoringSheets/getAll',
  async (_, thunkAPI) => {
    try {
      return await monitoringSheetsService.getAllMonitoringSheets();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Erro ao buscar fichas de acompanhamento'
      );
    }
  }
);
 
// GET BY ID
export const getMonitoringSheetById = createAsyncThunk(
  'monitoringSheets/getById',
  async (id, thunkAPI) => {
    try {
      return await monitoringSheetsService.getMonitoringSheetById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Erro ao buscar ficha de acompanhamento'
      );
    }
  }
);
 
// CREATE
export const createMonitoringSheet = createAsyncThunk(
  'monitoringSheets/create',
  async (data, thunkAPI) => {
    try {
      return await monitoringSheetsService.createMonitoringSheet(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Erro ao criar ficha de acompanhamento'
      );
    }
  }
);
 
// UPDATE
export const updateMonitoringSheet = createAsyncThunk(
  'monitoringSheets/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await monitoringSheetsService.updateMonitoringSheet(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Erro ao atualizar ficha de acompanhamento'
      );
    }
  }
);
 
// DELETE
export const deleteMonitoringSheet = createAsyncThunk(
  'monitoringSheets/delete',
  async (id, thunkAPI) => {
    try {
      await monitoringSheetsService.deleteMonitoringSheet(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Erro ao deletar ficha de acompanhamento'
      );
    }
  }
);
 
const initialState = {
  list: [],
  selectedSheet: null,
  isLoading: false,
  isError: false,
  message: ''
};
 
const monitoringSheetsSlice = createSlice({
  name: 'monitoringSheets',
  initialState,
  reducers: {
    clearSelectedSheet: (state) => {
      state.selectedSheet = null;
    },
    clearError: (state) => {
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllMonitoringSheets.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAllMonitoringSheets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(getAllMonitoringSheets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // GET BY ID
      .addCase(getMonitoringSheetById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMonitoringSheetById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedSheet = action.payload;
      })
      .addCase(getMonitoringSheetById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // CREATE
      .addCase(createMonitoringSheet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMonitoringSheet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list.push(action.payload);
      })
      .addCase(createMonitoringSheet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // UPDATE
      .addCase(updateMonitoringSheet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMonitoringSheet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = state.list.map((sheet) =>
          sheet.id === action.payload.id ? action.payload : sheet
        );
      })
      .addCase(updateMonitoringSheet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // DELETE
      .addCase(deleteMonitoringSheet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteMonitoringSheet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = state.list.filter((sheet) => sheet.id !== action.payload);
      })
      .addCase(deleteMonitoringSheet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});
 
export const { clearSelectedSheet, clearError } = monitoringSheetsSlice.actions;
export const monitoringSheetsReducer = monitoringSheetsSlice.reducer;