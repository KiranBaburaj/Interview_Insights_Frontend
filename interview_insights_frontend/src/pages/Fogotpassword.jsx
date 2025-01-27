import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Paper,
  ThemeProvider,
  Link
} from '@mui/material';
import theme from '../theme/theme';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleRequestOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/request-password-reset/', { email });
      setStep(2);
    } catch (error) {
      console.error('Error requesting OTP:', error);
      setError('Failed to request OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/password-reset-confirm/', { email, otp, new_password: newPassword });
      setStep(3);
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <Container maxWidth="xs">
          <Box
            sx={{
              mt: 8,
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <RouterLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
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
            </RouterLink>
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
            {step === 1 && (
              <Box component="div">
                <Typography
                  variant="h5"
                  align="center"
                  sx={{
                    mb: 3,
                    color: theme.palette.common.purple.main,
                    fontWeight: 600
                  }}
                >
                  Reset Password
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{
                    mb: 3,
                    color: 'text.secondary'
                  }}
                >
                  Enter your email address and we'll send you a verification code
                </Typography>
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  variant="contained"
                  fullWidth
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
                  onClick={handleRequestOtp}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Request OTP'}
                </Button>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" sx={{ display: 'inline', color: 'text.secondary' }}>
                    Remembered your password?{' '}
                  </Typography>
                  <Link
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: theme.palette.common.purple.main,
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Log in here
                  </Link>
                </Box>
              </Box>
            )}

            {step === 2 && (
              <Box component="div">
                <Typography
                  variant="h5"
                  align="center"
                  sx={{
                    mb: 3,
                    color: theme.palette.common.purple.main,
                    fontWeight: 600
                  }}
                >
                  Verify OTP
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  sx={{
                    mb: 3,
                    color: 'text.secondary'
                  }}
                >
                  Enter the verification code and your new password
                </Typography>
                <TextField
                  margin="normal"
                  fullWidth
                  id="otp"
                  label="OTP"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
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
                  fullWidth
                  id="newPassword"
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  variant="contained"
                  fullWidth
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
                  onClick={handleResetPassword}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Reset Password'}
                </Button>
              </Box>
            )}

            {step === 3 && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    color: theme.palette.common.purple.main,
                    fontWeight: 600
                  }}
                >
                  Password Reset Successful!
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    color: 'text.secondary'
                  }}
                >
                  Your password has been successfully reset.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    py: 1.5,
                    background: theme.palette.common.purple.gradient,
                    boxShadow: theme.palette.common.purple.shadow,
                    '&:hover': {
                      background: theme.palette.common.purple.gradient,
                      opacity: 0.9,
                    },
                  }}
                  onClick={handleLoginRedirect}
                >
                  Go to Login
                </Button>
              </Box>
            )}

            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
                {error}
              </Alert>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ForgotPassword;
