import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage, addMessage } from '../features/chat/chatSlice';
import { connectWebSocket, sendWebSocketMessage, closeWebSocket } from '../utils/websocket';
import { Box, Button, Paper, TextField, Typography, Divider } from '@mui/material';

const ChatRoom = () => {
  const dispatch = useDispatch();
  const currentChatRoom = useSelector(state => state.chat.currentChatRoom);
  console.log(currentChatRoom)
  const messages = useSelector(state => state.chat.messages);
  console.log(messages)
  const token = useSelector(state => state.auth.accessToken); // Assuming you have token in auth slice
  const user = useSelector(state => state.auth.user); // Assuming you have userId in auth slice
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const userid = useSelector(state => state.auth.userid);

  useEffect(() => {
    if (currentChatRoom && token) {
      dispatch(fetchMessages(currentChatRoom.id));
      const socket = connectWebSocket(currentChatRoom.id, (message) => {
        // Assuming the message object has an 'id' field
        if (message.id) {
          dispatch(addMessage(message));
        } else {
          console.error('Received message without id:', message);
        }
      }, token);

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
        user_id: userid, // Include user_id in the payload
        timestamp: new Date().toISOString() // Optional: Include timestamp if needed
      };

      dispatch(sendMessage({ chatRoomId: currentChatRoom.id, content: newMessage }));
      sendWebSocketMessage(messagePayload); // Send the payload with user_id
      
      setNewMessage('');
    }
  };

  if (!currentChatRoom) return <Typography>Select a chat room</Typography>;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Chat with {currentChatRoom.jobseeker.id} - {currentChatRoom.employer.id}
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
        }}
      >
     {messages.map(message => (
  <Paper
    key={message.id || `temp-${message.timestamp}`}
    sx={{
      mb: 1,
      p: 1,
      borderRadius: 1,
      backgroundColor: '#f1f8e9',
    }}
  >
    <Typography variant="body2" gutterBottom>
      <strong>{message.sender?.name || message.sender?.id || 'Unknown'}:</strong> {message.content}
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
  );
};

export default ChatRoom;
