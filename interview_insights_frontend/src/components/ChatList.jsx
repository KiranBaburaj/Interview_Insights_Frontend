import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, setCurrentChatRoom } from '../features/chat/chatSlice';
import { Card, CardContent, Typography, List, ListItem, CircularProgress, Container } from '@mui/material';

const ChatList = () => {
  const dispatch = useDispatch();
  const chatRooms = useSelector(state => state.chat.chatRooms);
  const status = useSelector(state => state.chat.status);
  const currentUser = useSelector(state => state.auth.user);

  useEffect(() => {
    dispatch(fetchChatRooms());
  }, [dispatch]);

  if (status === 'loading') return <CircularProgress />;
  if (status === 'failed') return <Typography color="error">Error loading chat rooms</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Chat 
      </Typography>
      <List>
        {chatRooms.map(room => {
          const otherPerson = room.jobseeker.id === currentUser.id ? room.employer : room.jobseeker;

          return (
            <ListItem 
              key={room.id} 
              button 
              onClick={() => dispatch(setCurrentChatRoom(room))}
              sx={{ mb: 2, p: 2, borderRadius: 1, boxShadow: 1, '&:hover': { backgroundColor: '#f5f5f5' } }}
            >
              <Card variant="outlined" sx={{ flexGrow: 1 }}>
                <CardContent>
                  <Typography variant="h6">
                    {otherPerson.full_name}
                  </Typography>
                  {room.last_message && (
                    <Typography variant="body2" color="textSecondary">
                      Last message: {room.last_message.content}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
};

export default ChatList;
