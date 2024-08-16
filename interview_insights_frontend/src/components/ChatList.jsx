import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, setCurrentChatRoom } from '../features/chat/chatSlice';
import {
  Typography,
  List,
  ListItem,
  CircularProgress,
  Container,
  Avatar,
  Box,
  Divider,
  TextField,
} from '@mui/material';

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

  if (status === 'loading') return <CircularProgress />;
  if (status === 'failed') return <Typography color="error">Error loading chat rooms</Typography>;

  return (
    <Container
      sx={{
        height: '100vh',
        padding: 2,
        backgroundImage: `url('https://example.com/your-background-image.jpg')`, // Replace with your background image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
        Chats
      </Typography>

      {/* Search Field */}
      <TextField
        variant="outlined"
        placeholder="Search Chats..."
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ bgcolor: 'white', borderRadius: '5px' }}
      />

      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'rgba(255, 255, 255, 0.8)', borderRadius: '10px', overflow: 'auto' }}>
        {filteredChatRooms.map(room => {
          const otherPerson = room.jobseeker.id === currentUser.id ? room.employer : room.jobseeker;

          return (
            <React.Fragment key={room.id}>
              <ListItem 
                button 
                onClick={() => dispatch(setCurrentChatRoom(room))}
                sx={{ borderRadius: '10px', bgcolor: '#fff', mb: 1, padding: 1, '&:hover': { bgcolor: '#f1f1f1' } }}
              >
                <Avatar
                  src={`http://localhost:8000${otherPerson.profile_photo}`} 
                  alt={otherPerson.full_name}
                  sx={{ width: 56, height: 56, mr: 2 }}
                />
                <Box sx={{ flexGrow: 1, padding: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {otherPerson.full_name}
                  </Typography>
                  {room.last_message && (
                    <Typography variant="body2" color="textSecondary">
                      {room.last_message.content.length > 30 ? `${room.last_message.content.slice(0, 30)}...` : room.last_message.content}
                    </Typography>
                  )}
                </Box>
              </ListItem>
              <Divider sx={{ bgcolor: '#e0e0e0' }} />
            </React.Fragment>
          );
        })}
      </List>
    </Container>
  );
};

export default ChatList;