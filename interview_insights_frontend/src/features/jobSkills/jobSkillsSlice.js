// features/jobSkills/jobSkillsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';

// Define your async thunk to add a skill
export const addSkill = createAsyncThunk(
  'jobSkills/addSkill',
  async (skillData) => {
    try {
      const response = await axiosInstance.post('api/job-skills/', skillData); // Adjust the API endpoint as needed
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Define your fetchJobSkills async thunk
export const fetchJobSkills = createAsyncThunk(
  'jobSkills/fetchJobSkills',
  async () => {
    const response = await axiosInstance.get('api/job-skills/');
    return response.data;
  }
);

// Define your updateSkill async thunk
export const updateSkill = createAsyncThunk(
  'jobSkills/updateSkill',
  async ({ skillId, skillData }) => {
    try {
      const response = await axiosInstance.put(`api/job-skills/${skillId}/`, skillData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Define your deleteSkill async thunk
export const deleteSkill = createAsyncThunk(
  'jobSkills/deleteSkill',
  async (skillId) => {
    try {
      const response = await axiosInstance.delete(`api/job-skills/${skillId}/`);
      return skillId;
    } catch (error) {
      throw error;
    }
  }
);

const jobSkillsSlice = createSlice({
  name: 'jobSkills',
  initialState: {
    skills: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobSkills.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobSkills.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.skills = action.payload;
      })
      .addCase(fetchJobSkills.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addSkill.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.skills.push(action.payload);
      })
      .addCase(addSkill.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateSkill.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.skills.findIndex(skill => skill.id === action.payload.id);
        if (index !== -1) {
          state.skills[index] = action.payload;
        }
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteSkill.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.skills = state.skills.filter(skill => skill.id !== action.payload);
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default jobSkillsSlice.reducer;

export const selectAllSkills = (state) => state.jobSkills.skills;