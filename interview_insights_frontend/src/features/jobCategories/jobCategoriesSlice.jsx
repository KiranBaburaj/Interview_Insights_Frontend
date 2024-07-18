import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';

// Define your async thunk to add a category
export const addCategory = createAsyncThunk(
  'jobCategories/addCategory',
  async (categoryData) => {
    try {
      const response = await axiosInstance.post('api/job-categories/', categoryData); // Adjust the API endpoint as needed
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Define your fetchJobCategories async thunk
export const fetchJobCategories = createAsyncThunk(
  'jobCategories/fetchJobCategories',
  async () => {
    const response = await axiosInstance.get('api/job-categories/');
    return response.data;
  }
);

const jobCategoriesSlice = createSlice({
  name: 'jobCategories',
  initialState: {
    categories: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchJobCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // You can update state.categories here if needed
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default jobCategoriesSlice.reducer;

export const selectAllCategories = (state) => state.jobCategories.categories;
