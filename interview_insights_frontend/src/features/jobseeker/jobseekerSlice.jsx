import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getJobSeekers, getJobSeeker, createJobSeeker, updateJobSeeker, deleteJobSeeker } from '../../api';

export const fetchJobSeekers = createAsyncThunk('jobSeeker/fetchJobSeekers', async () => {
  const response = await getJobSeekers();
  return response.data;
});

export const fetchJobSeeker = createAsyncThunk('jobSeeker/fetchJobSeeker', async (id) => {
  const response = await getJobSeeker(id);
  return response.data;
});

export const addJobSeeker = createAsyncThunk('jobSeeker/addJobSeeker', async (data) => {
  const response = await createJobSeeker(data);
  return response.data;
});

export const editJobSeeker = createAsyncThunk('jobSeeker/editJobSeeker', async ({ id, data }) => {
  const response = await updateJobSeeker(id, data);
  return response.data;
});

export const removeJobSeeker = createAsyncThunk('jobSeeker/removeJobSeeker', async (id) => {
  await deleteJobSeeker(id);
  return id;
});

export const toggleActiveStatus = createAsyncThunk('jobseeker/toggleActiveStatus', async (id) => {
  const response = await axios.post(`/employers/${id}/toggle_active/`);
  return id;
});



const jobSeekerSlice = createSlice({
  name: 'jobSeeker',
  initialState: {
    jobSeekers: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobSeekers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobSeekers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobSeekers = action.payload;
      })
      .addCase(fetchJobSeekers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchJobSeeker.fulfilled, (state, action) => {
        const existingJobSeeker = state.jobSeekers.find(js => js.id === action.payload.id);
        if (!existingJobSeeker) {
          state.jobSeekers.push(action.payload);
        }
      })
      .addCase(addJobSeeker.fulfilled, (state, action) => {
        state.jobSeekers.push(action.payload);
      })
      .addCase(editJobSeeker.fulfilled, (state, action) => {
        const index = state.jobSeekers.findIndex(js => js.id === action.payload.id);
        state.jobSeekers[index] = action.payload;
      })
      .addCase(removeJobSeeker.fulfilled, (state, action) => {
        state.jobSeekers = state.jobSeekers.filter(js => js.id !== action.payload);
      })
      .addCase(toggleActiveStatus.fulfilled, (state, action) => {
        const jobSeeker = state.jobSeekers.find(js => js.user.id === action.payload);
        jobSeeker.user.is_active = !jobSeeker.user.is_active;
      });
  },
});

export default jobSeekerSlice.reducer;

// Selectors
export const selectAllJobSeekers = (state) => state.jobSeeker.jobSeekers;
export const selectJobSeekerById = (state, jobSeekerId) => state.jobSeeker.jobSeekers.find((js) => js.id === jobSeekerId);
export const selectJobSeekerStatus = (state) => state.jobSeeker.status;
export const selectJobSeekerError = (state) => state.jobSeeker.error;
