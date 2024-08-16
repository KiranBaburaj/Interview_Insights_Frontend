import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup, clearError } from '../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  CircularProgress,
  Link as MuiLink,
  Avatar
} from '@mui/material';
import GoogleLoginButton from './GoogleLoginButton';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'job_seeker',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [openError, setOpenError] = useState(false);

  useEffect(() => {
    if (error) {
      setOpenError(true);
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000); // Clear error after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignupAndSendOTP = async (e) => {
    e.preventDefault();

    const { email, password, full_name, role } = formData;

    if (!email || !password || !full_name || !role) {
      alert('All fields are required');
      return;
    }

    const data = {
      user: { email, password, full_name },
      role,
    };

    try {
      await dispatch(signup(data)).unwrap();
      navigate('/verify-otp');
    } catch (error) {
      console.error('Failed to send OTP:', error);
    }
  };

  const avatarImageUrl = '/logo.PNG';

  const handleCloseError = () => {
    setOpenError(false);
    dispatch(clearError());
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Avatar src={avatarImageUrl} sx={{ width: 56, height: 56, margin: 'auto' }} />
        <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
          Welcome to Interview Insights
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSignupAndSendOTP} sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="full_name"
              label="Full Name"
              name="full_name"
              autoComplete="name"
              autoFocus
              value={formData.full_name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="job_seeker">Job Seeker</MenuItem>
                <MenuItem value="employer">Employer</MenuItem>
   
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
          </Box>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <MuiLink component={Link} to="/login" variant="body2">
                Log in
              </MuiLink>
            </Typography>
            
          </Box>     <Box sx={{ mt: 2 }}>
              <GoogleLoginButton/>
            </Box>
        </Paper>
      </Box>
      <Snackbar
        open={openError}
        autoHideDuration={5000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error?.detail ? error.detail : "An error occurred."}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SignupForm;