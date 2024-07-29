// features/jobCategories/jobCategoriesSlice.js

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

// Define your updateCategory async thunk
export const updateCategory = createAsyncThunk(
  'jobCategories/updateCategory',
  async ({ categoryId, categoryData }) => {
    try {
      const response = await axiosInstance.put(`api/job-categories/${categoryId}/`, categoryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Define your deleteCategory async thunk
export const deleteCategory = createAsyncThunk(
  'jobCategories/deleteCategory',
  async (categoryId) => {
    try {
      const response = await axiosInstance.delete(`api/job-categories/${categoryId}/`);
      return categoryId;
    } catch (error) {
      throw error;
    }
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
        state.categories.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.categories.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = state.categories.filter(category => category.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default jobCategoriesSlice.reducer;

export const selectAllCategories = (state) => state.jobCategories.categories;
