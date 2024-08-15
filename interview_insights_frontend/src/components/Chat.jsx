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
        height: '80vh', // Reduced the overall height from 100vh to 80vh
      }}
    >
      <Navbar />
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid item xs={4}>
          <Paper
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              p: 2,
              overflowY: 'auto',
              borderRight: '1px solid #ddd',
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
