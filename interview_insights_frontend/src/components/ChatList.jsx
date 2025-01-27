import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, setCurrentChatRoom } from '../features/chat/chatSlice';
import {
  Typography,
  List,
  ListItem,
  CircularProgress,
  Avatar,
  Box,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { formatDistanceToNow } from 'date-fns';

const ChatList = () => {
  const dispatch = useDispatch();
  const chatRooms = useSelector(state => state.chat.chatRooms);
  const status = useSelector(state => state.chat.status);
  const currentUser = useSelector(state => state.auth.user);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchChatRooms());
  }, [dispatch]);

  const filteredChatRooms = chatRooms.filter(room => {
    const otherPerson = room.jobseeker.id === currentUser.id ? room.employer : room.jobseeker;
    return otherPerson.full_name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">Error loading chat rooms</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          bgcolor: '#fff',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a1a1a' }}>
          Messages
        </Typography>

        <TextField
          fullWidth
          size="small"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#f8f9fa',
              borderRadius: 2,
              '&.Mui-focused': {
                '& fieldset': {
                  borderColor: 'primary.main',
                },
              },
            },
          }}
        />
      </Box>

      {/* Chat List */}
      <List
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 0,
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
        {filteredChatRooms.map(room => {
          const otherPerson = room.jobseeker.id === currentUser.id ? room.employer : room.jobseeker;
          const lastMessageTime = room.last_message?.created_at
            ? formatDistanceToNow(new Date(room.last_message.created_at), { addSuffix: true })
            : '';

          return (
            <React.Fragment key={room.id}>
              <ListItem
                button
                onClick={() => dispatch(setCurrentChatRoom(room))}
                sx={{
                  px: 2,
                  py: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <Avatar
                  src={`http://localhost:8000${otherPerson.profile_photo}`}
                  alt={otherPerson.full_name}
                  sx={{
                    width: 48,
                    height: 48,
                    mr: 2,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: '#2d3748',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {otherPerson.full_name}
                    </Typography>
                    {lastMessageTime && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                          ml: 1,
                          flexShrink: 0,
                        }}
                      >
                        {lastMessageTime}
                      </Typography>
                    )}
                  </Box>
                  {room.last_message && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {room.last_message.content}
                    </Typography>
                  )}
                </Box>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          );
        })}
        {filteredChatRooms.length === 0 && searchTerm && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No conversations found matching "{searchTerm}"
            </Typography>
          </Box>
        )}
      </List>
    </Box>
  );
};

export default ChatList;