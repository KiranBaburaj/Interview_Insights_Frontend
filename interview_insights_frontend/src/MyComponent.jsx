// src/MyComponent.jsx
import React from 'react';
import { Box, CircularProgress, Typography, Avatar } from '@mui/material';

const MyComponent = () => {
    const avatarImageUrl = '/logo.PNG'; // Path to your logo

    return (
        <Box sx={{ position: 'relative', textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            <CircularProgress size={160} sx={{ position: 'absolute', top: '50%', left: '50%', margin: '-30px 0 0 -30px' }} />
            <Avatar src={avatarImageUrl} sx={{ width: 56, height: 56, margin: 'auto', position: 'relative', zIndex: 1 }} />
           
            <Typography variant="h6" sx={{ marginTop: '10px' }}>
            Interview Insights
            </Typography>
            <Typography variant="h6" sx={{ marginTop: '200px' }}>
                Loading...
            </Typography>
        </Box>
    );
};

export default MyComponent;