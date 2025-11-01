import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import studentService from "../../services/studentService";

export const fetchStudents = createAsyncThunk("students/fetchAll", async () => {
    return await studentService.getAllStudents();
});

export const fetchStudentById = createAsyncThunk("students/fetchById", async (id) => {
    return await studentService.getStudentById(id);
});

export const fetchStudentByName = createAsyncThunk("students/fetchByName", async (name) => {
    return await studentService.getStudentByName(name);
});

export const addStudent = createAsyncThunk("students/add", async (student) => {
    return await studentService.createStudent(student);
});

export const editStudent = createAsyncThunk("students/edit", async ({ id, studentData }) => {
    return await studentService.updateStudent(id, studentData);
});

export const removeStudent = createAsyncThunk("students/remove", async (id) => {
    return await studentService.deleteStudent(id)
});

const studentSlice = createSlice({
    name: "students",
    initialState: {
        students: [],
        studentDetail: null,
        loading: false,
        error: null,
        success: false,
    },

    reducers: {
        resetSucess: (state) => {
            state.success = false;
        },
        clearStudentDetail: (state) => {
            state.studentDetail = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // 🔹 Buscar todos
            .addCase(fetchStudents.pending, (state) => {
                state.students = [];
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudents.fulfilled, (state, { payload }) => {
                state.students = payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchStudents.rejected, (state, { payload }) => {
                state.error = 'Erro ao buscar alunos';
                state.loading = false;
                state.students = [];
                console.error(payload);
            })

            // 🔹 Buscar por ID
            .addCase(fetchStudentById.fulfilled, (state, action) => {
                state.studentDetail = action.payload;
            })

            // 🔹 Buscar por nome
            .addCase(fetchStudentByName.fulfilled, (state, action) => {
                state.students = action.payload;
                state.loading = false;
                state.error = null;
            })

            .addCase(fetchStudentByName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            
            .addCase(fetchStudentByName.rejected, (state, action) => {
                state.loading = false;
                state.error = "Erro ao buscar alunos por nome";
            })

            // 🔹 Criar aluno
            .addCase(addStudent.pending, (state) => {
                state.loading = true;
            })
            .addCase(addStudent.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.success = true;
                state.students.push(payload);
            })
            .addCase(addStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // 🔹 Editar aluno
            .addCase(editStudent.fulfilled, (state) => {
                state.success = true;
            })

            // 🔹 Excluir produto
            .addCase(removeStudent.fulfilled, (state, action) => {
                state.students = state.students.filter((p) => p.id !== action.meta.arg);
                state.success = true;
            })
    },
    selectors: {
        selectAllStudents: (state) => state.students,
        selectLoading: (state) => state.loading,
        selectError: (state) => state.error,
        selectSuccess: (state) => state.success,
    }
});

export const { resetSuccess, clearStudentDetail } = studentSlice.actions;
export const { selectAllStudents, selectLoading, selectError, selectSuccess } = studentSlice.selectors;
export const studentReducer = studentSlice.reducer;