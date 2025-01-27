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
              mt: 4,
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <RouterLink 
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
