// features/jobApplicationSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    applications: [],
    status: 'idle',
    error: null
};

export const applyForJob = createAsyncThunk('applications/applyForJob', async (applicationData, { getState }) => {
    const { token } = getState().auth;  // Assume you have an auth slice managing JWT
    const response = await axios.post('/api/applications/', applicationData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
});

const jobApplicationSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(applyForJob.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(applyForJob.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.applications.push(action.payload);
            })
            .addCase(applyForJob.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export default jobApplicationSlice.reducer;
