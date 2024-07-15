import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosConfig'; // Assuming axiosConfig.js defines Axios instance

// Define your async thunks for API calls
export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/signup/', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/login/', userData);
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/admin/login/', formData);
      // Store admin tokens in localStorage
      localStorage.setItem('adminAccessToken', response.data.accessToken);
      localStorage.setItem('adminRefreshToken', response.data.refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (data, { rejectWithValue }) => {
    try {
      console.log('Data received in sendOTP action:', data);
      const response = await axios.post('/api/send-otp/', data); // Adjust endpoint as per your API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const verifyOTPAndSignup = createAsyncThunk(
  'auth/verifyOTPAndSignup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/verify-otp/', userData);
      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAdminData = createAsyncThunk(
  'admin/fetchAdminData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/data'); // Adjust endpoint as per your API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Thunks for fetching data
export const fetchJobSeekers = createAsyncThunk(
  'admin/fetchJobSeekers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/jobseekers/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const fetchEmployers = createAsyncThunk(
  'admin/fetchEmployers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/employers/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const fetchRecruiters = createAsyncThunk(
  'admin/fetchRecruiters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/recruiters/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Define initial state and reducers
const initialState = {
  user: null,
  role: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  loading: false,
  jobSeekers: [],
  employers: [],
  recruiters: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup reducers
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login reducers
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        console.log(state.user)
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.role = action.payload.role; // Assuming role is returned from API
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Admin login reducers
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        // Store admin tokens in localStorage
        localStorage.setItem('adminAccessToken', action.payload.accessToken);
        localStorage.setItem('adminRefreshToken', action.payload.refreshToken);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send OTP reducers
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify OTP and Signup reducers
      .addCase(verifyOTPAndSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTPAndSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.role = action.payload.role;
      })
      .addCase(verifyOTPAndSignup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAdminData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Adjust payload structure based on API response
        state.error = null;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchJobSeekers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobSeekers.fulfilled, (state, action) => {
        state.loading = false;
        state.jobSeekers = action.payload;
      })
      .addCase(fetchJobSeekers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEmployers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployers.fulfilled, (state, action) => {
        state.loading = false;
        state.employers = action.payload;
      })
      .addCase(fetchEmployers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecruiters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecruiters.fulfilled, (state, action) => {
        state.loading = false;
        state.recruiters = action.payload;
      })
      .addCase(fetchRecruiters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
