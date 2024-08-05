// features/notifications/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig'; // Adjust the path
// Define initial state
const initialState = {
  notifications: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch notifications from the server
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (token) => {
    const response = await axiosInstance.get('/api/notifications/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

// Async thunk to mark a notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (notificationId, { getState }) => {
    const token = getState().auth.token; // Adjust based on your auth state
    const response = await axiosInstance.post(`/api/notifications/${notificationId}/mark_as_read/`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

// Create the slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    updateNotification: (state, action) => {
      const index = state.notifications.findIndex(notification => notification.id === action.payload.id);
      if (index !== -1) {
        state.notifications[index] = action.payload;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(notification => notification.id === action.payload.id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
      });
  },
});

// Export actions and reducer
export const { addNotification, updateNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
