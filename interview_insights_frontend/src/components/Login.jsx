import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError, setUser } from '../features/auth/authSlice';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Snackbar,
  CircularProgress,
  Alert,
  AlertTitle,
  Link as MuiLink,
  Avatar
} from '@mui/material';
import GoogleLoginButton from './GoogleLoginButton';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, role } = useSelector((state) => state.auth);
  const [openError, setOpenError] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData)).then((result) => {
      if (result.payload) {
        dispatch(setUser(result.payload));
      }
    });
  };

  useEffect(() => {
    if (role) {
      if (role === 'jobseeker') {
        navigate('/dashboard/jobseeker');
      } else if (role === 'employer') {
        navigate('/EmployerCompanyManagement');
      } else if (role === 'recruiter') {
        navigate('/dashboard/recruiter');
      } else if (role === 'admin') {
        navigate('/admindashboard');
      }
    }
  }, [role, navigate]);

  useEffect(() => {
    if (error) {
      setOpenError(true);
      if (error.detail === 'Email not verified') {
        navigate('/verify-otp');
      }
    }
  }, [error, navigate]);

  const handleCloseError = () => {
    setOpenError(false);
    dispatch(clearError());
  };

  const avatarImageUrl = '/logo.PNG';

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        {/* Wrap Avatar with Link */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Avatar src={avatarImageUrl} sx={{ width: 56, height: 56, margin: 'auto' }} />
        </Link>
        <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
          Welcome to Interview Insights
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Paper elevation={3} sx={{ p: 4 }}>

        <Box sx={{ mt: 2 }}>
              <GoogleLoginButton />
            </Box>
            
          <Typography component="h2" variant="h6" align="center" sx={{ mb: 2 }}>
            Login
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Box>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              <MuiLink component={Link} to="/forgot-password" variant="body2">
                Forgot Password?
              </MuiLink>
              <br />
              Don't have an account?{' '}
              <MuiLink component={Link} to="/signup" variant="body2">
                Sign up
              </MuiLink>
            </Typography>
         
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
          <AlertTitle>Error</AlertTitle>
          {error?.detail ? error.detail : ""}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Login;