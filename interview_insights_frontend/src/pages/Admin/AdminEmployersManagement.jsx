import React from 'react';
import { Box, CssBaseline, Typography, CircularProgress, Alert } from '@mui/material';
import AdminNavbar from './AdminNavbar';
import EmployerManagement from '../../components/EmployersManagement';
import { useSelector } from 'react-redux';

const AdminEmployersManagement = () => {
  const { employers, loading: authLoading, error: authError } = useSelector((state) => state.auth);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AdminNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Employers
        </Typography>

        {authLoading && <CircularProgress />}
        {authError && <Alert severity="error">{authError}</Alert>}

        <EmployerManagement />
      </Box>
    </Box>
  );
};

export default AdminEmployersManagement;
