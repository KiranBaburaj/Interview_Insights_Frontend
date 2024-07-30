import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../axiosConfig';

export const fetchChatRooms = createAsyncThunk(
  'chat/fetchChatRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/chatrooms/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// New thunk for creating a chat room
export const createChatRoom = createAsyncThunk(
  'chat/createChatRoom',
  async ({ jobseekerId, employerId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/chatrooms/', { jobseekerId, employerId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (chatRoomId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/chatrooms/${chatRoomId}/messages/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatRoomId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/api/chatrooms/${chatRoomId}/messages/`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatRooms: [],
    currentChatRoom: null,
    messages: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setCurrentChatRoom: (state, action) => {
      state.currentChatRoom = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatRooms.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chatRooms = action.payload;
      })
      .addCase(fetchChatRooms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(createChatRoom.fulfilled, (state, action) => {
        state.chatRooms.push(action.payload); // Add the new chat room to the list
        state.currentChatRoom = action.payload; // Optionally set as current chat room
      });
  },
});

export const { setCurrentChatRoom, addMessage } = chatSlice.actions;

export default chatSlice.reducer;