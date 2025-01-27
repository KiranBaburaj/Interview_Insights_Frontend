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
  ThemeProvider
} from '@mui/material';
import GoogleLoginButton from './GoogleLoginButton';
import theme from '../theme/theme';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'job_seeker',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, role } = useSelector((state) => state.auth);
  const [openError, setOpenError] = useState(false);

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
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
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
              mt: 4,
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Link 
              to="/"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                background: 'linear-gradient(to right, #ffffff, #f8f9fa)',
                padding: '10px 20px',
                borderRadius: '16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.8)',
                position: 'relative',
                overflow: 'hidden',
              }}
              sx={{
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  background: 'linear-gradient(to right, #ffffff, #f0f2f5)',
                  '& .shine-effect': {
                    transform: 'translateX(100%)',
                  }
                },
                '&:active': {
                  transform: 'translateY(1px)',
                }
              }}
            >
              <Box
                className="shine-effect"
                sx={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 70%)',
                  transform: 'translateX(-100%)',
                  transition: 'transform 0.6s',
                }}
              />
              <Box
                component="img"
                src="https://d3dxvti62y5mgw.cloudfront.net/ccp_logo_icon.webp"
                alt="Navigation Logo"
                sx={{
                  width: '52px',
                  height: 'auto',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  transform: 'translateZ(0)',
                  willChange: 'transform',
                }}
              />
              <Box
                sx={{
                  ml: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '1.8rem',
                    color: '#1a1a1a',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    '& .gradient-text': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 900,
                      marginLeft: '1px'
                    }
                  }}
                >
                  CC<span className="gradient-text">P</span>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.75rem',
                    color: '#666',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    mt: '2px'
                  }}
                >
                  Career Campus Pro
                </Typography>
              </Box>
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
              Create Your Account
            </Typography>

            <Box component="form" onSubmit={handleSignupAndSendOTP}>
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
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
                autoComplete="new-password"
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
              <FormControl 
                fullWidth 
                margin="normal"
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
              >
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
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign Up'}
              </Button>
            </Box>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <MuiLink 
                  component={Link} 
                  to="/login" 
                  sx={{ 
                    color: theme.palette.common.purple.main,
                    textDecoration: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Log in
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
          {error?.detail ? error.detail : "An error occurred."}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default SignupForm;