import React from 'react';
import { Box, Grid, Paper } from '@mui/material';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';
import Navbar from './Navbar';

const Chat = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // Use full height for a more immersive experience
        bgcolor: '#f0f0f0', // Light background to mimic WhatsApp's theme
      }}
    >
      <Navbar />
      <Grid container spacing={0} sx={{ flexGrow: 1 }}>
        <Grid item xs={4} sx={{ borderRight: '1px solid #ddd' }}>
          <Paper
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              bgcolor: '#ffffff', // White background for the chat list
              overflowY: 'auto',
            }}
          >
            <ChatList />
          </Paper>
        </Grid>
        <Grid item xs={8}>
          <Paper
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              bgcolor: '#ffffff', // White background for the chat room
              overflowY: 'auto',
            }}
          >
            <ChatRoom />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Chat;