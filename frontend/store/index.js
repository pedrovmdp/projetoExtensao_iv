import { configureStore } from "@reduxjs/toolkit";
import { companyReducer } from "./features/companySlice";
import authReducer from "./features/authSlice"
import { reviewReducer } from "./features/reviewSlice"
import { peopleCompanyReducer } from "./features/peopleCompanySlice";
import { peopleReducer } from "./features/peopleSlice";
import { usersReducer } from "./features/usersSlice";
import { rolesReducer } from "./features/roleSlice";
import { questionsReducer } from "./features/questionsSlice";
import { monitoringSheetsReducer } from "./features/monitoringSheetSlice";

export const store = configureStore ({
    reducer:{
        companys: companyReducer,
        people: peopleReducer,
        auth: authReducer,
        users: usersReducer,
        peopleCompany: peopleCompanyReducer,
        reviews: reviewReducer,
        roles: rolesReducer,
        questions: questionsReducer,
        monitoringSheet: monitoringSheetsReducer,
    },
});