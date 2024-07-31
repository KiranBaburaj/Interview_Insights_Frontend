import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, setCurrentChatRoom } from '../features/chat/chatSlice';
import NewChatForm from './NewChatForm';
import { Card, CardContent, Typography, List, ListItem, CircularProgress, Container } from '@mui/material';

const ChatList = () => {
  const dispatch = useDispatch();
  const chatRooms = useSelector(state => state.chat.chatRooms);
  const status = useSelector(state => state.chat.status);

  useEffect(() => {
    dispatch(fetchChatRooms());
  }, [dispatch]);

  if (status === 'loading') return <CircularProgress />;
  if (status === 'failed') return <Typography color="error">Error loading chat rooms</Typography>;

  return (
    <Container>
      <NewChatForm />
      <Typography variant="h4" gutterBottom>
        Chat Rooms
      </Typography>
      <List>
        {chatRooms.map(room => (
          <ListItem 
            key={room.id} 
            button 
            onClick={() => dispatch(setCurrentChatRoom(room))}
            sx={{ mb: 2, p: 2, borderRadius: 1, boxShadow: 1, '&:hover': { backgroundColor: '#f5f5f5' } }}
          >
            <Card variant="outlined" sx={{ flexGrow: 1 }}>
              <CardContent>
                <Typography variant="h6">
                  {room.jobseeker.username} - {room.employer.username}
                </Typography>
                {room.last_message && (
                  <Typography variant="body2" color="textSecondary">
                    Last message: {room.last_message.content}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ChatList;
