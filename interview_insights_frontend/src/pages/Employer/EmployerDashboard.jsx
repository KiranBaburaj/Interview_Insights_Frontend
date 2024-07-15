import React from 'react';
import { useSelector } from 'react-redux';
import { Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import EmployerNavbar from '../../components/EmployerNavbar';

const EmployerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <EmployerNavbar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
      >
        <Toolbar />
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user ? user.full_name : 'Employer'}
        </Typography>
        {/* Display employer-specific components and features here */}
      </Box>
    </Box>
  );
};

export default EmployerDashboard;
