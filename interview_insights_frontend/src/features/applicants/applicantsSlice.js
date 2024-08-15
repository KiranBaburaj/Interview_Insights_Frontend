// src/features/applicants/applicantsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';

const initialState = {
  applicants: [],
  status: 'idle',
  error: null,
  job_Id:localStorage.getItem('job_Id') || null,
};

// Fetch applicants
export const fetchApplicants = createAsyncThunk(
  'applicants/fetchApplicants',
  async (jobId) => {
    const response = await axiosInstance.get(`api/jobs/${jobId}/applicants/`);
    return response.data;
  }
);

// Update applicant status
export const updateApplicantStatus = createAsyncThunk(
  'applicants/updateApplicantStatus',
  async ({ applicantId, status }) => {
    const response = await axiosInstance.patch(
      `api/jobs/${applicantId}/applications/status/`,
      { status }
    );
    return { id: applicantId, status: response.data.status };
  }
);

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
        state.job_Id=action.payload[0].job;
        localStorage.setItem('job_Id', action.payload[0].job);
        console.log(action.payload[0].job)
        console.log(state.job_Id)
  
      })
      .addCase(fetchApplicants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateApplicantStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateApplicantStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const existingApplicant = state.applicants.find((applicant) => applicant.id === id);
        if (existingApplicant) {
          existingApplicant.status = status;
        }
        state.status = 'succeeded';
      })
      .addCase(updateApplicantStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default applicantsSlice.reducer;
