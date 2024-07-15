import React from 'react';
import { useSelector } from 'react-redux';
import { Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import EmployerNavbar from '../../components/EmployerNavbar';
import JobList from '../../components/JobList';
import AddJobForm from '../../components/AddJobForm';

const Employerjobs = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <EmployerNavbar />
      <Box><JobList></JobList><AddJobForm/>
        
      </Box>
    </Box>
  );
};

export default Employerjobs;
