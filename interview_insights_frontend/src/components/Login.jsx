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
  ThemeProvider
} from '@mui/material';
import GoogleLoginButton from './GoogleLoginButton';
import theme from '../theme/theme';

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

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: theme.palette.common.purple.gradient,
        }}
      >
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              mt: 8,
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Box
                component="img"
                src="https://d3dxvti62y5mgw.cloudfront.net/ccp_logo_icon.webp"
                alt="Navigation Logo"
                sx={{
                  width: '64px',
                  height: 'auto',
                  transition: 'transform 0.2s',
                  filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.2))',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
              <Typography
                variant="h3"
                sx={{
                  ml: 2,
                  fontWeight: 800,
                  fontFamily: 'sans-serif',
                  color: '#ffffff',
                  textShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                  '& .gradient-text': {
                    background: 'linear-gradient(to top left, #2563eb, #7c3aed)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }
                }}
              >
                CC<span className="gradient-text">P</span>
              </Typography>
            </Link>
          </Box>

          <Paper 
            elevation={6} 
            sx={{ 
              p: 4, 
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Box sx={{ mb: 3 }}>
              <GoogleLoginButton />
            </Box>

            <Typography 
              component="h2" 
              variant="h5" 
              align="center" 
              sx={{ 
                mb: 3,
                color: theme.palette.common.purple.main,
                fontWeight: 600
              }}
            >
              Login to Your Account
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.common.purple.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.common.purple.main,
                    },
                  },
                }}
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.common.purple.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.common.purple.main,
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  background: theme.palette.common.purple.gradient,
                  boxShadow: theme.palette.common.purple.shadow,
                  '&:hover': {
                    background: theme.palette.common.purple.gradient,
                    opacity: 0.9,
                  },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Login'}
              </Button>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <MuiLink 
                component={Link} 
                to="/forgot-password" 
                sx={{ 
                  color: theme.palette.common.purple.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Forgot Password?
              </MuiLink>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Don't have an account?{' '}
                <MuiLink 
                  component={Link} 
                  to="/signup" 
                  sx={{ 
                    color: theme.palette.common.purple.main,
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Sign up
                </MuiLink>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Snackbar
        open={openError}
        autoHideDuration={5000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <AlertTitle>Error</AlertTitle>
          {error?.detail ? error.detail : ""}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default Login;