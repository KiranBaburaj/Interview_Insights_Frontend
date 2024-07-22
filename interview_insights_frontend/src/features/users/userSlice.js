// src/features/users/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig'; // Adjust the path

const apiUrl = 'api/users/';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axiosInstance.get(apiUrl);
  return response.data;
});

export const fetchUser = createAsyncThunk('users/fetchUser', async (id) => {
  const response = await axiosInstance.get(`${apiUrl}${id}/`);
  return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (userData, { getState }) => {
  const state = getState();
  const token = state.auth.token; // Adjust based on where you store the token in your state
  const response = await axiosInstance.post(apiUrl, userData, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
});

export const editUser = createAsyncThunk('users/editUser', async ({ id, userData }) => {
  const response = await axiosInstance.put(`${apiUrl}${id}/`, userData);
  return response.data;
});

export const removeUser = createAsyncThunk('users/removeUser', async (id) => {
  await axiosInstance.delete(`${apiUrl}${id}/`);
  return id;
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    selectedUser: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(editUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;

export const selectAllUsers = (state) => state.users.users;
export const selectUserById = (state, userId) => state.users.users.find((user) => user.id === userId);
export const selectUserStatus = (state) => state.users.status;
export const selectUserError = (state) => state.users.error;
