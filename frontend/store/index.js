import { configureStore } from "@reduxjs/toolkit";
import { companyReducer } from "./features/companySlice";
import { studentReducer } from "./features/studentSlice";
import authReducer from "./features/authSlice"
import usersReducer from "./features/usersSlice"

export const store = configureStore ({
    reducer:{
        companys: companyReducer,
        students: studentReducer,
        auth: authReducer,
        users: usersReducer,
    },
});

