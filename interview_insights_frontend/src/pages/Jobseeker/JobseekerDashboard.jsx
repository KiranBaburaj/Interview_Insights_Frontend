import React from 'react';
import { useSelector } from 'react-redux';
import Logout from '../../components/Logout';
import {
  Container,
  Typography,
  Box,
  Link as MuiLink
} from '@mui/material';

const JobseekerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome, {user ? user.full_name : 'Jobseeker'}
        </Typography>
        {/* Display jobseeker-specific components and features here */}
        <Logout />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            {/* Example link */}
            <MuiLink href="#" variant="body2">
              Jobseeker Dashboard Link
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default JobseekerDashboard;
