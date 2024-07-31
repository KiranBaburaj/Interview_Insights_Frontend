import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage, getOrCreateChatRoom, addMessage } from '../features/chat/chatSlice';
import { connectWebSocket, sendWebSocketMessage, closeWebSocket } from '../utils/websocket';
import { Box, Button, Paper, TextField, Typography, Divider } from '@mui/material';

const ChatRoom = () => {
  const { jobseekerId, employerId } = useParams();
  const dispatch = useDispatch();
  const currentChatRoom = useSelector(state => state.chat.currentChatRoom);
  const messages = useSelector(state => state.chat.messages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (jobseekerId && employerId) {
      dispatch(getOrCreateChatRoom({ jobseekerId, employerId }));
    }
  }, [dispatch, jobseekerId, employerId]);

  useEffect(() => {
    if (currentChatRoom) {
      dispatch(fetchMessages(currentChatRoom.id));
      const socket = connectWebSocket(currentChatRoom.id, (message) => {
        dispatch(addMessage(message));
      });

      return () => {
        socket.close();
      };
    }
  }, [dispatch, currentChatRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && currentChatRoom) {
      dispatch(sendMessage({ chatRoomId: currentChatRoom.id, content: newMessage }));
      sendWebSocketMessage(newMessage);
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
        Chat with {currentChatRoom.jobseeker.username} - {currentChatRoom.employer.username}
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
            key={message.id}
            sx={{
              mb: 1,
              p: 1,
              borderRadius: 1,
              backgroundColor: message.sender.username === currentChatRoom.jobseeker.username ? '#e3f2fd' : '#f1f8e9',
            }}
          >
            <Typography variant="body2" gutterBottom>
              <strong>{message.sender.username}:</strong> {message.content}
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
