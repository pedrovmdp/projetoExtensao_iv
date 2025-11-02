import { configureStore } from "@reduxjs/toolkit";
import { companyReducer } from "./features/companySlice";
import { studentReducer } from "./features/studentSlice";
import authReducer from "./features/authSlice"
import usersReducer from "./features/usersSlice"
import { monitoringReducer } from "./features/monitoringSlice";

export const store = configureStore ({
    reducer:{
        companys: companyReducer,
        students: studentReducer,
        auth: authReducer,
        users: usersReducer,
        monitoring: monitoringReducer,
    },
});