import React from 'react';
import { Box, CssBaseline, Typography, CircularProgress, Alert } from '@mui/material';
import AdminNavbar from './AdminNavbar';
import JobSeekerList from '../../components/JobSeekerList';
import { useSelector } from 'react-redux';

const AdminJobSeeker = () => {
  const { jobSeekers, loading: authLoading, error: authError } = useSelector((state) => state.auth);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AdminNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Job Seekers
        </Typography>

        {authLoading && <CircularProgress />}
        {authError && <Alert severity="error">{authError}</Alert>}

        <JobSeekerList />
      </Box>
    </Box>
  );
};

export default AdminJobSeeker;
