import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axiosConfig'; // Assuming axiosConfig.js defines Axios instance


export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async ({ access_token, role }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/google/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token, role }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.access_token);
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/signup/', userData);
      if (response.data.user_id) {
        localStorage.setItem('user_id', response.data.user_id);

      } else {
        alert('Signup failed: ' + response.data.error);
      }
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
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('userid', response.data.user.id);

      localStorage.setItem('refreshToken', response.data.refreshToken);
      localStorage.setItem('role', response.data.role);
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
      const response = await axios.post('/api/send-otp/', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/resend-otp/', userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const verifyOTPAndSignup = createAsyncThunk(
  'auth/verifyOTPAndSignup',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/verify-otp/', userData);
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
      const response = await axios.get('/api/admin/data');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

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

const initialState = {
  user:localStorage.getItem('user') ||null ,
  role: localStorage.getItem('role') || null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  userid:localStorage.getItem('userid') || null,
  full_name:localStorage.getItem('full_name') || null,
  error: null,
  loading: false,
  jobSeekers: [],
  employers: [],
  recruiters: [],
  companyDetailsSubmitted:localStorage.getItem('companyDetailsSubmitted') || false,
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
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.userid = null;
      state.full_name = null;
      state.companyDetailsSubmitted = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      localStorage.removeItem('userid');
      localStorage.removeItem('full_name');
      localStorage.removeItem('companyDetailsSubmitted');
      localStorage.removeItem('job_Id');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.role = action.payload.role;
        state.userid = action.payload.user.id;
        state.full_name = action.payload.user.full_name;
        state.companyDetailsSubmitted = action.payload.companyDetailsSubmitted;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('role', action.payload.role);
        localStorage.setItem('user', action.payload.user);
        localStorage.setItem('userid', action.payload.user.id);
        localStorage.setItem('full_name', action.payload.user.full_name);
        localStorage.setItem('companyDetailsSubmitted', action.payload.companyDetailsSubmitted);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

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
        state.user = action.payload.user;
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
      })

      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.role = action.payload.role;
        state.userid = action.payload.user.id;
        state.full_name = action.payload.user.full_name;
        state.companyDetailsSubmitted = action.payload.companyDetailsSubmitted;
        localStorage.setItem('accessToken', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('role', action.payload.role);
        localStorage.setItem('user', action.payload.user);
        localStorage.setItem('full_name', action.payload.user.full_name);
        localStorage.setItem('companyDetailsSubmitted', action.payload.companyDetailsSubmitted);
        
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});




export const { clearError, setUser, logout,user } = authSlice.actions;

export default authSlice.reducer;
