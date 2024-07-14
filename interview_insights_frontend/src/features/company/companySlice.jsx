// src/features/company/companySlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = 'http://localhost:8000/';  // Django API URL

export const fetchCompanies = createAsyncThunk('company/fetchCompanies', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${apiUrl}/companies/`, {
      headers: {
        Authorization: `Bearer ${thunkAPI.getState().auth.accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const createCompany = createAsyncThunk('company/createCompany', async (companyData, thunkAPI) => {
  try {
    const response = await axios.post(`${apiUrl}/companies/`, companyData, {
      headers: {
        Authorization: `Bearer ${thunkAPI.getState().auth.accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateCompany = createAsyncThunk('company/updateCompany', async (companyData, thunkAPI) => {
  try {
    const { id, ...rest } = companyData;
    const response = await axios.put(`${apiUrl}/companies/${id}/`, rest, {
      headers: {
        Authorization: `Bearer ${thunkAPI.getState().auth.accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const companySlice = createSlice({
  name: 'company',
  initialState: {
    companies: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.companies.push(action.payload);
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex(company => company.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      });
  }
});

export default companySlice.reducer;
