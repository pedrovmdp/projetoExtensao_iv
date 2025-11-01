import { configureStore } from "@reduxjs/toolkit";
import { companyReducer } from "./features/companySlice";
import { studentReducer } from "./features/studentSlice";
import authReducer from "./features/authSlice"

export const store = configureStore ({
    reducer:{
        companys: companyReducer,
        students: studentReducer,
        auth: authReducer,
    },
});

