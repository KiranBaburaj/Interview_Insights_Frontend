import React from 'react';
import { useSelector } from 'react-redux';
import { Box, CssBaseline } from '@mui/material';
import EmployerNavbar from '../../components/EmployerNavbar';
import JobManagement from '../../components/AddJobForm';

const Employerjobs = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      <EmployerNavbar />
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <JobManagement />
      </Box>
    </Box>
  );
};

export default Employerjobs;