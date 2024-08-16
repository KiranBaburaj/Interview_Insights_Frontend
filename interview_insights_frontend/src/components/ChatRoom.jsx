import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, addMessage } from '../features/chat/chatSlice';
import { connectWebSocket, sendWebSocketMessage, closeWebSocket } from '../utils/websocket';
import { Box, Button, Paper, TextField, Typography, Divider } from '@mui/material';
import { connectNotificationWebSocket, sendNotificationWebSocketMessage } from '../utils/notificationWebSocket';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b', // Deep teal
    },
    secondary: {
      main: '#b2dfdb', // Light teal
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const ChatRoom = () => {
  const dispatch = useDispatch();
  const currentChatRoom = useSelector(state => state.chat.currentChatRoom);
  const messages = useSelector(state => state.chat.messages);
  const token = useSelector(state => state.auth.accessToken);
  const user = useSelector(state => state.auth.user);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const userid = useSelector(state => state.auth.userid);
  const full_name = useSelector(state => state.auth.full_name);

  useEffect(() => {
    if (currentChatRoom && token) {
      dispatch(fetchMessages(currentChatRoom.id));
      const socket = connectWebSocket(currentChatRoom.id, (message) => {
        const messageWithId = message.id ? message : { ...message, id: `temp-${Date.now()}` };
        dispatch(addMessage(messageWithId));
      }, token);

      const notificationSocket = connectNotificationWebSocket(token, userid, dispatch);

      return () => {
        closeWebSocket();
      };
    }
  }, [dispatch, currentChatRoom, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messagePayload = {
        type: 'chat_message',
        message: newMessage,
        user_id: userid,
        full_name: full_name,
        timestamp: new Date().toISOString()
      };

      sendWebSocketMessage(messagePayload);

      const notificationPayload = {
        type: 'notification',
        message: `New message from ${full_name}`,
        user_id: userid,
        room_id: currentChatRoom.id,
      };

      sendNotificationWebSocketMessage(notificationPayload);

      setNewMessage('');
    }
  };

  if (!currentChatRoom) return <Typography>Select a chat room</Typography>;

  const otherPerson = currentChatRoom.jobseeker.id === user.id ? currentChatRoom.employer : currentChatRoom.jobseeker;

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '80vh',
          maxWidth: '800px',
          width: '100%',
          margin: '0 auto',
          padding: 2,
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Chat with {otherPerson.full_name}
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            mb: 2,
            border: '1px solid #ddd',
            borderRadius: 1,
            p: 2,
            backgroundColor: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            // Removed fixed height to allow for dynamic height
          }}
        >
          {messages.map(message => (
            <Paper
              key={message.id || `temp-${message.timestamp}`}
              sx={{
                mb: 1,
                p: 1,
                borderRadius: 1,
                backgroundColor: message.sender.id === userid ? '#e3f2fd' : '#f1f8e9',
                alignSelf: message.sender.id === userid ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                wordBreak: 'break-word',
              }}
            >
              <Typography variant="body2" gutterBottom>
                <strong>{message.sender.full_name || `${message.sender.name}`}:</strong> {message.content || 'No content'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {new Date(message.timestamp).toLocaleString()}
              </Typography>
            </Paper>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            sx={{ mr: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
          >
            Send
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default ChatRoom;