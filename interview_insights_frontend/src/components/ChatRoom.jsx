import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, addMessage } from '../features/chat/chatSlice';
import { connectWebSocket, sendWebSocketMessage, closeWebSocket } from '../utils/websocket';
import { 
  Box, 
  TextField, 
  Typography, 
  Paper,
  Avatar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { connectNotificationWebSocket, sendNotificationWebSocketMessage } from '../utils/notificationWebSocket';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

  if (!currentChatRoom) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          bgcolor: '#fff'
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Select a conversation to start messaging
        </Typography>
      </Box>
    );
  }

  const otherPerson = currentChatRoom.jobseeker.id === user.id ? currentChatRoom.employer : currentChatRoom.jobseeker;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#fff',
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          bgcolor: '#fff',
        }}
      >
        <Avatar
          src={`http://localhost:8000${otherPerson.profile_photo}`}
          alt={otherPerson.full_name}
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
            {otherPerson.full_name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {otherPerson.email}
          </Typography>
        </Box>
        <IconButton size="small">
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          bgcolor: '#f8f9fa',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f8f9fa',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cfd8dc',
            borderRadius: '3px',
            '&:hover': {
              background: '#b0bec5',
            },
          },
        }}
      >
        {messages.map(message => {
          const isOwnMessage = message.sender.id === userid;
          return (
            <Box
              key={message.id || `temp-${message.timestamp}`}
              sx={{
                display: 'flex',
                justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              {!isOwnMessage && (
                <Avatar
                  src={`http://localhost:8000${message.sender.profile_photo}`}
                  alt={message.sender.full_name}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
              )}
              <Box
                sx={{
                  maxWidth: '70%',
                  minWidth: '100px',
                  position: 'relative',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: isOwnMessage ? '#1976d2' : '#fff',
                    color: isOwnMessage ? '#fff' : 'inherit',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                    {message.content || 'No content'}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: 'block',
                      textAlign: 'right',
                      mt: 0.5,
                      color: isOwnMessage ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                      fontSize: '0.75rem',
                    }}
                  >
                    {new Date(message.timestamp).toLocaleString([], { 
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true 
                    })}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          bgcolor: '#fff',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <IconButton size="small" sx={{ color: 'action.active' }}>
          <AttachFileIcon />
        </IconButton>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: '#f8f9fa',
              '&.Mui-focused': {
                '& fieldset': {
                  borderColor: '#1976d2',
                },
              },
            },
          }}
        />
        <IconButton 
          type="submit"
          disabled={!newMessage.trim()}
          sx={{
            bgcolor: '#1976d2',
            color: '#fff',
            '&:hover': {
              bgcolor: '#1565c0',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(25, 118, 210, 0.5)',
              color: '#fff',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatRoom;