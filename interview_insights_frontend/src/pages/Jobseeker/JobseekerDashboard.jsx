import React from 'react';
import { useSelector } from 'react-redux';
import { Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import EmployerNavbar from '../../components/EmployerNavbar';
import JobseekerNavbar from '../../components/JobseekerNavbar';

const JobseekerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <JobseekerNavbar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
      >
        <Toolbar />
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user ? user.full_name : 'Jobseeker'}
        </Typography>
        {/* Display employer-specific components and features here */}
      </Box>
    </Box>
  );
};

export default JobseekerDashboard;
