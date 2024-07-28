// src/features/applicants/applicantsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';

const initialState = {
  applicants: [],
  status: 'idle',
  error: null,
};

export const fetchApplicants = createAsyncThunk('applicants/fetchApplicants', async (jobId) => {
  const response = await axiosInstance.get(`api/jobs/${jobId}/applicants/`);
  return response.data;
});

const applicantsSlice = createSlice({
  name: 'applicants',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApplicants.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchApplicants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.applicants = action.payload;
      })
      .addCase(fetchApplicants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default applicantsSlice.reducer;
