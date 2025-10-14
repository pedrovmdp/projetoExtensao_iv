import { configureStore } from "@reduxjs/toolkit";
import { companyReducer } from "./features/companySlice";

export const store = configureStore ({
    reducer:{
        companys: companyReducer,
    }
})