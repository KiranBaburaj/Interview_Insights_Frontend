import React from 'react';
import { useSelector } from 'react-redux';
import { Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import JobseekerNavbar from '../../components/JobseekerNavbar';
import Profile from '../../components/Jobseeker/JobseekerProfileForm';

const JobseekerProfile = () => {

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

        </Typography>
        <Profile />
      </Box>
    </Box>
  );
};

export default JobseekerProfile;
