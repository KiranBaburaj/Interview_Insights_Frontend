// src/features/users/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../../api';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await getUsers();
  return response.data;
});

export const fetchUser = createAsyncThunk('users/fetchUser', async (id) => {
  const response = await getUser(id);
  return response.data;
});

export const addUser = createAsyncThunk('users/addUser', async (userData) => {
  const response = await createUser(userData);
  return response.data;
});

export const editUser = createAsyncThunk('users/editUser', async ({ id, userData }) => {
  const response = await updateUser(id, userData);
  return response.data;
});

export const removeUser = createAsyncThunk('users/removeUser', async (id) => {
  await deleteUser(id);
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
