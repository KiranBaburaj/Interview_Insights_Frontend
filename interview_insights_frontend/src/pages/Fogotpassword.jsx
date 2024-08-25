import React, { useState } from 'react';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Link // Import Link from @mui/material
} from '@mui/material';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const handleLoginRedirect = () => {
    navigate('/login');}

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
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        {step === 1 && (
          <Box component="div">
            <Typography variant="h4" align="center" gutterBottom>
              Forgot Password
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
              onClick={handleRequestOtp}
            >
              {loading ? <CircularProgress size={24} /> : 'Request OTP'}
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Remembered your password?   <Button onClick={handleLoginRedirect} color="primary">
        Log in here
      </Button>
            </Typography>
          </Box>
        )}

        {step === 2 && (
          <Box component="div">
            <Typography variant="h4" align="center" gutterBottom>
              Enter OTP and New Password
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              id="otp"
              label="OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <TextField
              margin="normal"
              fullWidth
              id="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
              onClick={handleResetPassword}
            >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Go back to <Link href="/">Home</Link>
            </Typography>
          </Box>
        )}

        {step === 3 && (
          <Typography variant="h4" align="center" gutterBottom>
            Password reset successful!
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default ForgotPassword;
