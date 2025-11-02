import { configureStore } from "@reduxjs/toolkit";
import { companyReducer } from "./features/companySlice";
import { studentReducer } from "./features/studentSlice";
import { monitoringReducer } from "./features/monitoringSlice";

export const store = configureStore ({
    reducer:{
        companys: companyReducer,
        students: studentReducer,
        monitoring: monitoringReducer,
    }
})