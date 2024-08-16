import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  Avatar
} from '@mui/material';

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

  const avatarImageUrl = '/logo.PNG'; // Update with your actual logo path

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
          <Typography component="h1" variant="h5" align="center">
            Verify OTP
          </Typography>
          <Box component="form" onSubmit={handleVerifyOTP} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="Enter OTP"
              name="otp"
              value={otp}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loadingVerify || globalLoading}
            >
              {loadingVerify ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>
          </Box>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={handleResendOTP}
            disabled={loadingResend || globalLoading}
          >
            {loadingResend ? <CircularProgress size={24} /> : 'Resend OTP'}
          </Button>
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
          {error?.error ? error.error : ''}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VerifyOTP;