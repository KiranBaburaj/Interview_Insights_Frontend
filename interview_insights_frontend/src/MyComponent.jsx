// src/MyComponent.jsx
import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import logo from '../assets/logo.PNG'; // Adjust the path as necessary

const MyComponent = () => {
    return (
        <Box sx={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            <Avatar src={logo} sx={{ width: 56, height: 56, margin: 'auto' }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
                Welcome to My Component!
            </Typography>
            <Typography variant="body1">
                You've successfully loaded this component dynamically.
            </Typography>
        </Box>
    );
};

export default MyComponent;