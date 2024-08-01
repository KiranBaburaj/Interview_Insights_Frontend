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

export const createChatRoom = createAsyncThunk(
  'chat/createChatRoom',
  async ({ jobseekerId, employerId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/chatrooms/', { jobseeker_id: jobseekerId, employer_id: employerId });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.existing_room) {
        // If the room already exists, return the existing room
        return error.response.data.existing_room;
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const getOrCreateChatRoom = createAsyncThunk(
  'chat/getOrCreateChatRoom',
  async ({ jobseekerId, employerId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/chatrooms/get_or_create/', { jobseeker_id: jobseekerId, employer_id: employerId });
      dispatch(setCurrentChatRoom(response.data));
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
  async ({ chatRoomId, content }, { getState, dispatch }) => {
    const state = getState();
    const user = state.auth.user;
    const tempMessage = {
      id: `temp-${Date.now()}`,
      content,
      sender: {
        id: user.id,
        name: user.name
      },
      timestamp: new Date().toISOString(),
    };
    dispatch(addMessage(tempMessage));

    try {
      const response = await axiosInstance.post(`/api/chatrooms/${chatRoomId}/messages/`, { content });
      return response.data;
    } catch (error) {
      dispatch(removeMessage(tempMessage.id));
      throw error;
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
      const newMessage = action.payload;
      // Ensure the sender information is included
      if (!newMessage.sender) {
        newMessage.sender = { id: newMessage.user_id, name: `User ${newMessage.user_id}` };
      }
      state.messages.push(newMessage);
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(message => message.id !== action.payload);
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