// src/features/company/companySlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosConfig';

const apiUrl = 'http://localhost:8000/api';  // Django API URL

export const fetchCompanies = createAsyncThunk('company/fetchCompanies', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${apiUrl}/companies/`, {
      headers: {
        Authorization: `Bearer ${thunkAPI.getState().auth.adminAccessToken}`
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

export const approveCompany = createAsyncThunk('company/approveCompany', async (companyId, thunkAPI) => {
    try {
      const response = await axios.patch(`${apiUrl}/companies/${companyId}/`, { is_approved: true }, {
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



export const addCompany = createAsyncThunk('companies/addCompany', async (company) => {
  const response = await axios.post('/api/companies/', company);
  return response.data;
});


export const deleteCompany = createAsyncThunk('companies/deleteCompany', async (id) => {
  await axios.delete(`/api/companies/${id}/`);
  return id;
});
export const toggleCompanyApproval = createAsyncThunk(
  'company/toggleCompanyApproval',
  async ({ id, token, csrfToken }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/companies/${id}/toggle_approval/`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRFToken': csrfToken,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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
      })
      .addCase(approveCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex(company => company.id === action.payload.id);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.companies.push(action.payload);
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter((company) => company.id !== action.payload);
      })
      .addCase(toggleCompanyApproval.fulfilled, (state, action) => {
        const company = state.companies.find((c) => c.id === action.payload.id);
        if (company) {
          company.is_approved = action.payload.is_approved;
        }
      });
  }
});

export default companySlice.reducer;
