import React from 'react';
import { Box, CssBaseline, Typography, CircularProgress, Alert } from '@mui/material';
import AdminNavbar from './AdminNavbar'; // Adjust import path as needed
import CompanyList from '../../components/Admincompany'; // Adjust import path as needed
import { useSelector } from 'react-redux';

const AdminCompany = () => {
  const { companies, loading: authLoading, error: authError } = useSelector((state) => state.company);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AdminNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Companies
        </Typography>

        {authLoading && <CircularProgress />}
        {authError && <Alert severity="error">{authError}</Alert>}

        <CompanyList />
      </Box>
    </Box>
  );
};

export default AdminCompany;
