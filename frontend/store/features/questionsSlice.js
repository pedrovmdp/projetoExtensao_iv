import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import questionsService from '../../services/questionService';

// GET ALL
export const getAllQuestions = createAsyncThunk(
  'questions/getAll',
  async (_, thunkAPI) => {
    try {
      return await questionsService.getAllQuestions();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao buscar perguntas'
      );
    }
  }
);

// GET BY ID
export const getQuestionById = createAsyncThunk(
  'questions/getById',
  async (id, thunkAPI) => {
    try {
      return await questionsService.getQuestionById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao buscar pergunta'
      );
    }
  }
);

// CREATE
export const createQuestion = createAsyncThunk(
  'questions/create',
  async (data, thunkAPI) => {
    try {
      return await questionsService.createQuestion(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao criar pergunta'
      );
    }
  }
);

// UPDATE
export const updateQuestion = createAsyncThunk(
  'questions/update',
  async ({ id, data }, thunkAPI) => {
    try {
      return await questionsService.updateQuestion(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao atualizar pergunta'
      );
    }
  }
);

// DELETE
export const deleteQuestion = createAsyncThunk(
  'questions/delete',
  async (id, thunkAPI) => {
    try {
      await questionsService.deleteQuestion(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || 'Erro ao deletar pergunta'
      );
    }
  }
);

const initialState = {
  list: [],
  selectedQuestion: null,
  isLoading: false,
  isError: false,
  message: ''
};

const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    clearSelectedQuestion: (state) => {
      state.selectedQuestion = null;
    }
  },
  extraReducers: (builder) => {
    builder

      // GET ALL
      .addCase(getAllQuestions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(getAllQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // GET BY ID
      .addCase(getQuestionById.fulfilled, (state, action) => {
        state.selectedQuestion = action.payload;
      })

      // CREATE
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // UPDATE
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.list = state.list.map((q) =>
          q.id === action.payload.id ? action.payload : q
        );
      })

      // DELETE
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (q) => q.id !== action.payload
        );
      });
  }
});

export const { clearSelectedQuestion } = questionsSlice.actions;
export const questionsReducer = questionsSlice.reducer;