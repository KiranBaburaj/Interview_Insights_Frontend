import React from 'react';
import { useSelector } from 'react-redux';
import { Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import JobseekerNavbar from '../../components/JobseekerNavbar';
import MyApplications from '../../components/Jobseeker/MyApplications';

const JobseekerJobs = () => {

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
        <MyApplications />
      </Box>
    </Box>
  );
};

export default JobseekerJobs;
