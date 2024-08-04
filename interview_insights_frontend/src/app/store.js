// src/app/store.js

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import companyReducer from '../features/company/companySlice';
import jobsReducer from '../features/jobs/jobsSlice';
import jobCategoriesReducer from '../features/jobCategories/jobCategoriesSlice';
import userReducer from '../features/users/userSlice';
import jobSeekerReducer from '../features/jobseeker/jobseekerSlice';
import profileReducer from '../features/jobseeker/jobseekerSlice2';
import employerReducer from '../features/employer/employerSlice';
import jobApplicationReducer from  '../features/jobapplication/jobApplicationSlice';
import applicantsReducer from  '../features/applicants/applicantsSlice';
import applicationsReducer from '../features/applications/applicationsSlice';
import interviewReducer from '../features/interview/interviewSlice';


import chatReducer from '../features/chat/chatSlice';


const store = configureStore({
  reducer: {
    auth: authReducer,
     company: companyReducer ,
     jobs: jobsReducer,
      jobCategories: jobCategoriesReducer, 
      users: userReducer,
      jobSeeker: jobSeekerReducer,
      profile: profileReducer,
      applications:jobApplicationReducer,
      employer: employerReducer,
      applicants:applicantsReducer,
      myapplications: applicationsReducer,
      chat: chatReducer,
      interview: interviewReducer,
    // other reducers can be added here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // for ignoring error about non-serializable values
    }),
});

export default store;