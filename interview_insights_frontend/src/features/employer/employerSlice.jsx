import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEmployers, getEmployer, createEmployer, updateEmployer, deleteEmployer } from '../../api';

// Async thunks for CRUD operations
export const fetchEmployers = createAsyncThunk('employer/fetchEmployers', async () => {
  const response = await getEmployers();
  return response.data;
});

export const fetchEmployer = createAsyncThunk('employer/fetchEmployer', async (id) => {
  const response = await getEmployer(id);
  return response.data;
});

export const addEmployer = createAsyncThunk('employer/addEmployer', async (data) => {
  const response = await createEmployer(data);
  return response.data;
});

export const editEmployer = createAsyncThunk('employer/editEmployer', async ({ id, data }) => {
  const response = await updateEmployer(id, data);
  return response.data;
});

export const removeEmployer = createAsyncThunk('employer/removeEmployer', async (id) => {
  await deleteEmployer(id);
  return id;
});

// Create slice
const employerSlice = createSlice({
  name: 'employer',
  initialState: {
    employers: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmployers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employers = action.payload;
      })
      .addCase(fetchEmployers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchEmployer.fulfilled, (state, action) => {
        const existingEmployer = state.employers.find(em => em.id === action.payload.id);
        if (!existingEmployer) {
          state.employers.push(action.payload);
        }
      })
      .addCase(addEmployer.fulfilled, (state, action) => {
        state.employers.push(action.payload);
      })
      .addCase(editEmployer.fulfilled, (state, action) => {
        const index = state.employers.findIndex(em => em.id === action.payload.id);
        state.employers[index] = action.payload;
      })
      .addCase(removeEmployer.fulfilled, (state, action) => {
        state.employers = state.employers.filter(em => em.id !== action.payload);
      });
  },
});

export default employerSlice.reducer;

// Selectors
export const selectAllEmployers = (state) => state.employer.employers;
export const selectEmployerById = (state, employerId) => state.employer.employers.find((em) => em.id === employerId);
export const selectEmployerStatus = (state) => state.employer.status;
export const selectEmployerError = (state) => state.employer.error;
