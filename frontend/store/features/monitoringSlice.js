import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import monitoringService from "../../services/monitoringService";

export const fetchMonitorings = createAsyncThunk("monitoring/fetchAll", async () => {
    return await monitoringService.getAllMonitorings();
});

export const fetchMonitoringById = createAsyncThunk("monitoring/fetchById", async (id) => {
    return await monitoringService.getMonitoringById(id);
});

export const addMonitoring = createAsyncThunk("monitoring/add", async (monitoringData) => {
    return await monitoringService.createMonitoring(monitoringData);
});

export const editMonitoring = createAsyncThunk("monitoring/edit", async ({ id, monitoringData }) => {
    return await monitoringService.updateMonitoring(id, monitoringData);
});

export const removeMonitoring = createAsyncThunk("monitoring/remove", async (id) => {
    return await monitoringService.deleteMonitoring(id)
});

const monitoringSlice = createSlice({
    name: "monitoring",
    initialState: {
        monitoring: [],
        monitoringDetails: null,
        loading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetSuccess: (state) => {
            state.success = false;
        },
        clearMonitoringDetail: (state) => {
            state.monitoringDetails = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMonitorings.pending, (state) => {
                state.monitoring = [];
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMonitorings.fulfilled, (state, { payload }) => {
                state.monitoring = payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchMonitorings.rejected, (state, action) => {
                state.error = "Erro ao buscar acompanhamentos de alunos";
                state.loading = false;
                state.monitoring = [];
                console.error(action.error);
            })
            .addCase(addMonitoring.fulfilled, (state, { payload }) => {
                state.monitoring.push(payload);
                state.success = true;
            })
            .addCase(removeMonitoring.fulfilled, (state, action) => {
                state.monitoring = state.monitoring.filter(
                    (p) => p.id !== action.meta.arg
                );
                state.success = true;
            });
    },
});

export const { resetSuccess, clearMonitoringDetail } = monitoringSlice.actions;
export const monitoringReducer = monitoringSlice.reducer;

// 🔹 Selectors fora do slice
export const selectAllMonitoring = (state) => state.monitoring.monitoring;
export const selectLoading = (state) => state.monitoring.loading;
export const selectError = (state) => state.monitoring.error;
export const selectSuccess = (state) => state.monitoring.success;