// src/features/applications/applicationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';

export const fetchApplications = createAsyncThunk('applications/fetchApplications', async () => {
  const response = await axiosInstance.get('/api/myapplications/');
  return response.data;
});

const applicationsSlice = createSlice({
  name: 'myapplications',
  initialState: {
    applications: [],
    status: 'idle',
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default applicationsSlice.reducer;
