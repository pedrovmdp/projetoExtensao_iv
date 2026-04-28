import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import peopleService from '../../services/peopleService';

// GET ALL
export const getAllPeople = createAsyncThunk(
  'people/getAll',
  async (_, thunkAPI) => {
    try {
      return await peopleService.getAllPeople(); // já vem []
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao buscar pessoas'
      );
    }
  }
);

// GET BY ID
export const getPersonById = createAsyncThunk(
  'people/getById',
  async (id, thunkAPI) => {
    try {
      return await peopleService.getPersonById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao buscar pessoa'
      );
    }
  }
);

// SEARCH
export const searchPeople = createAsyncThunk(
  'people/search',
  async (query, thunkAPI) => {
    try {
      return await peopleService.getPersonByNameOrCpf(query);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro na busca'
      );
    }
  }
);

// CREATE
export const createPerson = createAsyncThunk(
  'people/create',
  async (data, thunkAPI) => {
    try {
      return await peopleService.createPerson(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao criar pessoa'
      );
    }
  }
);

// UPDATE
export const updatePerson = createAsyncThunk(
  'people/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await peopleService.updatePerson(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao atualizar pessoa'
      );
    }
  }
);

// SOFT DELETE
export const deletePerson = createAsyncThunk(
  'people/delete',
  async (id, thunkAPI) => {
    try {
      const updated = await peopleService.deletePerson(id);
      return updated; // pessoa com status alterado
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao remover pessoa'
      );
    }
  }
);

const initialState = {
  list: [],
  searchResults: [],
  selectedPerson: null,
  isLoading: false,
  isError: false,
  message: ''
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    clearSelectedPerson: (state) => {
      state.selectedPerson = null;
    },
    clearSearch: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder

      // GET ALL
      .addCase(getAllPeople.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPeople.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(getAllPeople.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // GET BY ID
      .addCase(getPersonById.fulfilled, (state, action) => {
        state.selectedPerson = action.payload;
      })

      // SEARCH
      .addCase(searchPeople.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })

      // CREATE
      .addCase(createPerson.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // UPDATE
      .addCase(updatePerson.fulfilled, (state, action) => {
        state.list = state.list.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      })

      // SOFT DELETE (status)
      .addCase(deletePerson.fulfilled, (state, action) => {
        state.list = state.list.map((item) =>
          item.id === action.payload.id ? action.payload : item
        );
      });
  }
});

export const {
  clearSelectedPerson,
  clearSearch
} = peopleSlice.actions;

export const peopleReducer = peopleSlice.reducer;