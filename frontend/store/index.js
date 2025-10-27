import { configureStore } from "@reduxjs/toolkit";
import { companyReducer } from "./features/companySlice";
import { studentReducer } from "./features/studentSlice";

export const store = configureStore ({
    reducer:{
        companys: companyReducer,
        students: studentReducer,
    }
})

