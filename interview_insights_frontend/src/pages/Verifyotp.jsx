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
  AlertTitle
} from '@mui/material';

const VerifyOTP = () => {
  const [otp, setOTP] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [openError, setOpenError] = useState(false);

  const handleChange = (e) => {
    setOTP(e.target.value);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    dispatch(clearError());

    // Dispatch the OTP verification action
    const resultAction = await dispatch(verifyOTPAndSignup({ otp }));

    // Check if the verification was successful
    if (verifyOTPAndSignup.fulfilled.match(resultAction)) {
      navigate('/login');
    } else {
      setOpenError(true);
    }
  };

  const handleCloseError = () => {
    setOpenError(false);
    dispatch(clearError());
  };

  const handleResendOTP = async () => {
    const userId = localStorage.getItem('user_id'); // Access user_id from local storage

    if (userId) {
      dispatch(clearError());
      await dispatch(resendOTP({ user_id: userId }));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ mt: 8 }}>
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
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>
          </Box>
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={handleResendOTP}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Resend OTP'}
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
