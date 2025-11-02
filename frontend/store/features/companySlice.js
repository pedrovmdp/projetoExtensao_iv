import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import companyService from "../../services/companyService";

export const fetchCompanys = createAsyncThunk("companys/fetchAll", async () => {
    return await companyService.getAllCompanys();
});

export const fetchCompanytById = createAsyncThunk("companys/fetchById", async (id) => {
    return await companyService.getCompanyById(id);
});

export const fetchCompanytByName = createAsyncThunk("companys/fetchByName", async (name) => {
    return await companyService.getCompanyByName(name);
});

export const addCompany = createAsyncThunk("companys/add", async (company) => {
    return await companyService.createCompany(company);
});

export const editCompany = createAsyncThunk("companys/edit", async ({ id, companyData }) => {
    return await companyService.updateCompany(id, companyData);
});

export const removeCompany = createAsyncThunk("companys/remove", async (id) => {
    return await companyService.deleteCompany(id)
});

const companySlice = createSlice({
    name: "companys",
    initialState: {
        companys: [],
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
            .addCase(fetchCompanys.pending, (state) => {
                state.companys = [];
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanys.fulfilled, (state, { payload }) => {
                state.companys = payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchCompanys.rejected, (state, { payload }) => {
                state.error = 'Erro ao buscar empresas';
                state.loading = false;
                state.companys = [];
                console.error(payload);
            })

            // 🔹 Buscar por ID
            .addCase(fetchCompanytById.fulfilled, (state, action) => {
                state.companyDetails = action.payload;
            })

            // 🔹 Buscar por nome
            .addCase(fetchCompanytByName.fulfilled, (state, action) => {
                state.companys = action.payload;
                state.loading = false;
                state.error = null;
            })

            // 🔹 Criar empresa
            .addCase(addCompany.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCompany.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.success = true;
                state.companys.push(payload);
            })
            .addCase(addCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // 🔹 Editar empresa
            .addCase(editCompany.fulfilled, (state) => {
                state.success = true;
            })

            // 🔹 Excluir produto
            .addCase(removeCompany.fulfilled, (state, action) => {
                state.companys = state.companys.filter((p) => p.id !== action.meta.arg);
                state.success = true;
            })
    },
    selectors: {
        selectAllCompanys: (state) => state.companys,
        selectLoading: (state) => state.loading,
        selectError: (state) => state.error,
        selectSuccess: (state) => state.success,
    }
});

export const { resetSuccess } = companySlice.actions;
export const { selectAllCompanys, selectLoading, selectError, selectSuccess } = companySlice.selectors;
export const companyReducer = companySlice.reducer;