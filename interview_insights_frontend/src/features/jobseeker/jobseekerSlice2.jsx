
import axiosInstance from '../../axiosConfig'; // Adjust the path as needed
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/jobseek/profile/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue, getState }) => {
    try {
      let hasFile = false;
      const formData = new FormData();
      const currentProfile = getState().profile.data;

      // First, add all current profile data to formData
      for (const [key, value] of Object.entries(currentProfile)) {
        if (['educations', 'work_experience', 'skills'].includes(key)) {
          formData.append(key, JSON.stringify(value));
        } else if (key !== 'profile_photo' && key !== 'resume') {
          formData.append(key, value);
        }
      }

      // Then, update with new data from profileData
      for (let [key, value] of profileData.entries()) {
        if (['educations', 'work_experience', 'skills'].includes(key)) {
          formData.set(key, JSON.stringify(JSON.parse(value)));
        } else if (key === 'profile_photo' || key === 'resume') {
          if (value instanceof File) {
            formData.set(key, value, value.name);
            hasFile = true;
          }
        } else {
          formData.set(key, value);
        }
      }

      let response;
      if (hasFile) {
        // If there are file uploads, use multipart/form-data
        response = await axiosInstance.put('/api/jobseek/profile/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // If no file uploads, convert to plain object and use application/json
        const plainObject = {};
        for (let [key, value] of formData.entries()) {
          if (['educations', 'work_experience', 'skills'].includes(key)) {
            plainObject[key] = JSON.parse(value);
          } else {
            plainObject[key] = value;
          }
        }
        response = await axiosInstance.put('/api/jobseek/profile/', plainObject, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    status: 'idle',profile: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default profileSlice.reducer;