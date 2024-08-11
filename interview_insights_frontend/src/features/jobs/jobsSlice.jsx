import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig'; // Adjust the path

const apiUrl = 'api/jobs/';

export const fetchSavedJobs = createAsyncThunk('jobs/fetchSavedJobs', async () => {
  const response = await axiosInstance.get('/api/saved-jobs/');
  return response.data;
});

export const saveJob = createAsyncThunk('jobs/saveJob', async (jobId) => {
  const response = await axiosInstance.post('/api/saved-jobs/', { job: jobId });
  return response.data;
});

export const unsaveJob = createAsyncThunk('jobs/unsaveJob', async (savedJobId) => {
  await axiosInstance.delete(`/api/saved-jobs/${savedJobId}/`);
  return savedJobId;
});

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (query = '') => {
  const response = await axiosInstance.get(`/api/jobs/?search=${query}`); // Adjust the API endpoint
  return response.data;
});

export const fetchJobById = createAsyncThunk('jobs/fetchJobById', async (jobId) => {
  const response = await axiosInstance.get(`${apiUrl}${jobId}/`);
  return response.data;
});

export const addJob = createAsyncThunk('jobs/addJob', async (jobData, { getState }) => {
  const state = getState();
  const token = state.auth.token; // Adjust based on where you store the token in your state
  const response = await axiosInstance.post(apiUrl, jobData, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
});

export const fetchMatchingJobs = createAsyncThunk('jobs/fetchMatchingJobs', async () => {
  const response = await axiosInstance.get('/api/matching-jobs/', );
  return response.data;
});



export const updateJob = createAsyncThunk('jobs/updateJob', async ({ jobId, jobData }) => {
  const response = await axiosInstance.put(`${apiUrl}${jobId}/`, jobData);
  return response.data;
});

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (jobId) => {
  await axiosInstance.delete(`${apiUrl}${jobId}/`);
  return jobId;
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    savedJobs: [],
    status: 'idle',
    matchingJobs: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchJobById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const job = action.payload;
        const existingJob = state.jobs.find((j) => j.id === job.id);
        if (!existingJob) {
          state.jobs.push(job);
        } else {
          Object.assign(existingJob, job);
        }
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const { id, ...updatedJob } = action.payload;
        const existingJob = state.jobs.find((job) => job.id === id);
        if (existingJob) {
          Object.assign(existingJob, updatedJob);
        }
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter((job) => job.id !== action.payload);
      })

      .addCase(fetchSavedJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.savedJobs = action.payload;
      })
      .addCase(fetchSavedJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveJob.fulfilled, (state, action) => {
        state.savedJobs.push(action.payload);
      })
      .addCase(unsaveJob.fulfilled, (state, action) => {
        state.savedJobs = state.savedJobs.filter((job) => job.id !== action.payload);
      })
      .addCase(fetchMatchingJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMatchingJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.matchingJobs = action.payload;
      })
      .addCase(fetchMatchingJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

  },
});

export default jobsSlice.reducer;

export const selectAllJobs = (state) => state.jobs.jobs;
export const selectJobById = (state, jobId) => {
  console.log('state:', state);
  console.log('jobId:', jobId);
  const job = state.jobs.jobs.find((job) => job.id == jobId);
  console.log('job:', job);
  return job;
};

export const selectSavedJobs = (state) => state.jobs.savedJobs; // New selector
export const selectMatchingJobs = (state) => state.jobs.matchingJobs;