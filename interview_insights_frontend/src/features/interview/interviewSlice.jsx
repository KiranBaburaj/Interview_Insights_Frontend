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
export const fetchFeedback = createAsyncThunk(
  'interviews/fetchFeedback',
  async (interviewId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/api/interview-feedbacks/${interviewId}/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


// Adjusted API paths
export const submitFeedback = createAsyncThunk(
  'interviews/submitFeedback',
  async ({ interviewId, feedbackData }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/interview-feedbacks/`, feedbackData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateFeedback = createAsyncThunk(
  'interviews/updateFeedback',
  async ({ id, feedbackData }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/interview-feedbacks/${id}/`, feedbackData);
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
    feedbacks: [],
    currentFeedback: null,
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
      })
      .addCase(submitFeedback.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.feedbacks.push(action.payload);
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle updating feedback
      .addCase(updateFeedback.fulfilled, (state, action) => {
        const index = state.feedbacks.findIndex(feedback => feedback.id === action.payload.id);
        if (index !== -1) {
          state.feedbacks[index] = action.payload;
        }
      })
      .addCase(fetchFeedback.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentFeedback = action.payload;
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

  },
});

export default interviewSlice.reducer;
