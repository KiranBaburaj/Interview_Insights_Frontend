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
  Alert,
  CircularProgress,
  Link as MuiLink
} from '@mui/material';

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

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(clearError()); // Dispatch action to clear error after timeout
    }, 5000); // 5000 milliseconds (5 seconds)

    return () => clearTimeout(timer); // Clean up timer on component unmount
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

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8 }}>
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
                <MenuItem value="recruiter">Recruiter</MenuItem>
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up and Send OTP'}
            </Button>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {JSON.stringify(error)}
            </Alert>
          )}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <MuiLink component={Link} to="/login" variant="body2">
                Log in
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignupForm;
