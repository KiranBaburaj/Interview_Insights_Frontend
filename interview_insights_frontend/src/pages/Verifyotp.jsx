import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { verifyOTPAndSignup, clearError, resendOTP } from '../features/auth/authSlice';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  AlertTitle,
  ThemeProvider
} from '@mui/material';
import theme from '../theme/theme';

const VerifyOTP = () => {
  const [otp, setOTP] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: globalLoading, error } = useSelector((state) => state.auth);
  const [openError, setOpenError] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);

  const handleChange = (e) => {
    setOTP(e.target.value);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    setLoadingVerify(true);
    dispatch(clearError());

    const resultAction = await dispatch(verifyOTPAndSignup({ otp }));

    if (verifyOTPAndSignup.fulfilled.match(resultAction)) {
      navigate('/login');
    } else {
      setOpenError(true);
    }
    setLoadingVerify(false);
  };

  const handleCloseError = () => {
    setOpenError(false);
    dispatch(clearError());
  };

  const handleResendOTP = async () => {
    const userId = localStorage.getItem('user_id');

    if (userId) {
      setLoadingResend(true);
      dispatch(clearError());
      await dispatch(resendOTP({ user_id: userId }));
      setLoadingResend(false);
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
              Verify Your Email
            </Typography>

            <Typography 
              variant="body1" 
              align="center" 
              sx={{ 
                mb: 3,
                color: 'text.secondary'
              }}
            >
              Please enter the verification code sent to your email address
            </Typography>

            <Box component="form" onSubmit={handleVerifyOTP}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="Enter OTP"
                name="otp"
                value={otp}
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
                disabled={loadingVerify || globalLoading}
              >
                {loadingVerify ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Verify OTP'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleResendOTP}
                disabled={loadingResend || globalLoading}
                sx={{
                  py: 1.5,
                  borderColor: theme.palette.common.purple.main,
                  color: theme.palette.common.purple.main,
                  '&:hover': {
                    borderColor: theme.palette.common.purple.main,
                    backgroundColor: 'rgba(124, 58, 237, 0.04)',
                  },
                }}
              >
                {loadingResend ? <CircularProgress size={24} sx={{ color: theme.palette.common.purple.main }} /> : 'Resend OTP'}
              </Button>
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
          {error?.error ? error.error : 'An error occurred during verification'}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default VerifyOTP;