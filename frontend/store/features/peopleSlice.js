import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import peopleService from "../../services/peopleService";

// GET ALL
export const getAllPeople = createAsyncThunk(
  "people/getAll",
  async (_, thunkAPI) => {
    try {
      return await peopleService.getAllPeople(); // já vem []
    } catch (error) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(" ")
        : error.response?.data?.message || "Erro ao buscar pessoas";

      return thunkAPI.rejectWithValue(message);
    }
  },
);

// GET BY ID
export const getPersonById = createAsyncThunk(
  "people/getById",
  async (id, thunkAPI) => {
    try {
      return await peopleService.getPersonById(id);
    } catch (error) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(" ")
        : error.response?.data?.message || "Erro ao buscar pessoa";

      return thunkAPI.rejectWithValue(message);
    }
  },
);

// SEARCH
export const searchPeople = createAsyncThunk(
  "people/search",
  async (query, thunkAPI) => {
    try {
      return await peopleService.getPersonByNameOrCpf(query);
    } catch (error) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(" ")
        : error.response?.data?.message || "Erro na busca";

      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const searchPeopleByRoleName = createAsyncThunk(
  "people/role/:roleName",
  async (roleName, thunkAPI) => {
    try {
      return await peopleService.getPersonByRoleName(roleName.toUpperCase())
    } catch (error) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(" ")
        : error.response?.data?.message || "Erro na busca por função";

      return thunkAPI.rejectWithValue(message);
    }
  },
  
);

// CREATE
export const createPerson = createAsyncThunk(
  "people/create",
  async (data, thunkAPI) => {
    try {
      return await peopleService.createPerson(data);
    } catch (error) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(" ")
        : error.response?.data?.message || "Erro ao criar pessoa";

      return thunkAPI.rejectWithValue(message);
    }
  },
);

// UPDATE
export const updatePerson = createAsyncThunk(
  "people/update",
  async ({ id, data }, thunkAPI) => {
    try {
      return await peopleService.updatePerson(id, data);
    } catch (error) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(" ")
        : error.response?.data?.message || "Erro ao atualizar pessoa";

      return thunkAPI.rejectWithValue(message);
    }
  },
);

// SOFT DELETE
export const deletePerson = createAsyncThunk(
  "people/delete",
  async (id, thunkAPI) => {
    try {
      const updated = await peopleService.deletePerson(id);
      return updated; // pessoa com status alterado
    } catch (error) {
      const message = Array.isArray(error.response?.data?.message)
        ? error.response.data.message.join(" ")
        : error.response?.data?.message || "Erro ao remover pessoa";

      return thunkAPI.rejectWithValue(message);
    }
  },
);

const initialState = {
  list: [],
  alunosAtivos: [],
  searchResults: [],
  selectedPerson: null,
  isLoading: false,
  isError: false,
  message: "",
};

const peopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {
    clearSelectedPerson: (state) => {
      state.selectedPerson = null;
    },
    clearSearch: (state) => {
      state.searchResults = [];
    },
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

      // CREATE
      .addCase(createPerson.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // UPDATE
      .addCase(updatePerson.fulfilled, (state, action) => {
        state.list = state.list.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
      })

      // SOFT DELETE (status)
      .addCase(deletePerson.fulfilled, (state, action) => {
        state.list = state.list.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
      })

      // SEARCH BY NAME OR CPF
      .addCase(searchPeople.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchPeople.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchPeople.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // SEARCH BY ROLE NAME
      .addCase(searchPeopleByRoleName.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchPeopleByRoleName.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alunosAtivos = action.payload;
      })
      .addCase(searchPeopleByRoleName.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { clearSelectedPerson, clearSearch } = peopleSlice.actions;

export const peopleReducer = peopleSlice.reducer;
