// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import companyReducer from '../features/company/companySlice';
import jobsReducer from '../features/jobs/jobsSlice';
import jobCategoriesReducer from '../features/jobCategories/jobCategoriesSlice';
import userReducer from '../features/users/userSlice';
const store = configureStore({
  reducer: {
    auth: authReducer, company: companyReducer ,
     jobs: jobsReducer,
      jobCategories: jobCategoriesReducer, user: userReducer,
    // other reducers can be added here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // for ignoring error about non-serializable values
    }),
});

export default store;