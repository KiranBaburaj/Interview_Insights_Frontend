import React from 'react';
import { useSelector } from 'react-redux';
import { Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import EmployerNavbar from '../../components/EmployerNavbar';
import CompanyManagement from '../../components/companymanagement';

const EmployerCompanyManagement = () => {
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
         <CompanyManagement/>
        </Typography>
        {/* Display employer-specific components and features here */}
      </Box>
    </Box>
  );
};

export default EmployerCompanyManagement;
