import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';

const initialState = {
  applications: [],
  status: 'idle',
  error: null,
  userApplicationStatus: {
    status: 'idle',
    hasApplied: false,
    error: null,
  },
};
export const checkApplicationStatus = createAsyncThunk(
  'applications/checkStatus',
  async (jobId, { getState }) => {
    const response = await axiosInstance.get(`/api/jobs/${jobId}/check-application-status/`);
    return response.data;
  }
);

export const applyForJob = createAsyncThunk(
  'applications/applyForJob',
  async ({ jobId, resume, cover_letter, use_profile_resume }, { getState }) => {
    const { token } = getState().auth;
    const formData = new FormData();
    formData.append('job', jobId);
    formData.append('resume', resume);
    formData.append('cover_letter', cover_letter);
    formData.append('use_profile_resume', use_profile_resume);

    const response = await axiosInstance.post('/api/applications/', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
);

const jobApplicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearApplicationError(state) {
      state.error = null;
    },
    clearUserApplicationStatus(state) {
      state.userApplicationStatus.status = 'idle';
      state.userApplicationStatus.error = null;
      state.userApplicationStatus.hasApplied = false;
    }
  },
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
      })
      .addCase(checkApplicationStatus.pending, (state) => {
        state.userApplicationStatus.status = 'loading';
      })
      .addCase(checkApplicationStatus.fulfilled, (state, action) => {
        state.userApplicationStatus.status = 'succeeded';
        state.userApplicationStatus.hasApplied = action.payload.hasApplied;
      })
      .addCase(checkApplicationStatus.rejected, (state, action) => {
        state.userApplicationStatus.status = 'failed';
        state.userApplicationStatus.error = action.error.message;
      });
  }
});

export const { clearApplicationError, clearUserApplicationStatus } = jobApplicationSlice.actions;

export const selectUserApplicationStatus = (state) => state.applications.userApplicationStatus;
export default jobApplicationSlice.reducer;
