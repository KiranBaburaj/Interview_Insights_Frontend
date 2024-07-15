// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import companyReducer from '../features/company/companySlice';
import jobsReducer from '../features/jobs/jobsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, company: companyReducer,jobs: jobsReducer,
    // other reducers can be added here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // for ignoring error about non-serializable values
    }),
});

export default store;