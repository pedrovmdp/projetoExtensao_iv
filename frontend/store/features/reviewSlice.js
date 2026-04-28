import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reviewService from "../../services/reviewService";

export const fetchReviews = createAsyncThunk("reviews/fetchAll", async () => {
    return await reviewService.getAllReviews();
});

export const fetchReviewById = createAsyncThunk("reviews/fetchById", async (id) => {
    return await reviewService.getReviewById(id);
});

export const fetchReviewsByPersonName = createAsyncThunk("reviews/fetchByPersonName", async (name) => {
    return await reviewService.getReviewsByPersonName(name);
});

export const addReview = createAsyncThunk("reviews/add", async (review) => {
    return await reviewService.createReview(review);
});

export const removeReview = createAsyncThunk("reviews/remove", async (id) => {
    return await reviewService.deleteReview(id)
});

const reviewSlice = createSlice({
    name: "reviews",
    initialState: {
        reviews: [],
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetSucess: (state) => {
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // 🔹 Buscar todos
            .addCase(fetchReviews.pending, (state) => {
                state.reviews = [];
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, { payload }) => {
                state.reviews = payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchReviews.rejected, (state, { payload }) => {
                state.error = 'Erro ao buscar avaliações';
                state.loading = false;
                state.reviews = [];
                console.error(payload);
            })

            // 🔹 Buscar por ID
            .addCase(fetchReviewById.fulfilled, (state, action) => {
                state.reviews = action.payload;
                state.loading = false;
                state.error = null;
            })

            // 🔹 Buscar por nome da pessoa
            .addCase(fetchReviewsByPersonName.fulfilled, (state, action) => {
                state.reviews = action.payload;
                state.loading = false;
                state.error = null;
            })

            // 🔹 Criar review
            .addCase(addReview.pending, (state) => {
                state.loading = true;
            })
            .addCase(addReview.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.success = true;
                state.reviews.push(payload);
            })
            .addCase(addReview.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // 🔹 Excluir review
            .addCase(removeReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter((p) => p.id !== action.meta.arg);
                state.success = true;
            })
    },
});

export const { resetSuccess, clearStudentDetail } = reviewSlice.actions;
export const reviewReducer = reviewSlice.reducer;

export const selectAllReviews = (state) => state.reviews.reviews;
export const selectLoading = (state) => state.reviews.loading;
export const selectError = (state) => state.reviews.error;
export const selectSuccess = (state) => state.reviews.success;