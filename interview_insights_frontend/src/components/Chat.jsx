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
        height: '100vh',
        bgcolor: '#f8f9fa',
      }}
    >
      <Navbar />
      <Grid 
        container 
        spacing={0} 
        sx={{ 
          flexGrow: 1,
          overflow: 'hidden',
          maxWidth: '1600px',
          mx: 'auto',
          width: '100%',
          p: { xs: 0, md: 2 },
        }}
      >
        <Grid 
          item 
          xs={4} 
          sx={{ 
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            height: 'calc(100vh - 64px)', // Subtract navbar height
          }}
        >
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#fff',
              borderRadius: { xs: 0, md: 2 },
              overflow: 'hidden',
            }}
          >
            <ChatList />
          </Paper>
        </Grid>
        <Grid 
          item 
          xs={8} 
          sx={{ 
            height: 'calc(100vh - 64px)', // Subtract navbar height
          }}
        >
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#fff',
              borderRadius: { xs: 0, md: 2 },
              overflow: 'hidden',
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