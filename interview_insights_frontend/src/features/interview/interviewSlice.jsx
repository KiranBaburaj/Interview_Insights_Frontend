// src/features/interviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig'; // Adjust the path to where axiosInstance is located

export const scheduleInterview = createAsyncThunk(
  'interviews/scheduleInterview',
  async (interviewData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/schedule-interview/', interviewData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateInterview = createAsyncThunk(
  'interviews/updateInterview',
  async ({ id, interviewData }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/update-interview/${id}/`, interviewData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchInterviews = createAsyncThunk(
  'interviews/fetchInterviews',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/interview-schedules/');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const interviewSlice = createSlice({
  name: 'interviews',
  initialState: {
    interviews: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(scheduleInterview.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(scheduleInterview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.interviews.push(action.payload);
      })
      .addCase(scheduleInterview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateInterview.fulfilled, (state, action) => {
        const index = state.interviews.findIndex(interview => interview.id === action.payload.id);
        if (index !== -1) {
          state.interviews[index] = action.payload;
        }
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.interviews = action.payload;
      });
  },
});

export default interviewSlice.reducer;
