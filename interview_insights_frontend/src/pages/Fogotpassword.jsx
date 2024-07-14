
// src/pages/ForgotPassword.jsx

import React, { useState } from 'react';
import axios from '../axiosConfig';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleRequestOtp = async () => {
    try {
      await axios.post('/api/request-password-reset/', { email });
      setStep(2);
    } catch (error) {
      console.error('Error requesting OTP:', error);
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post('/api/password-reset-confirm/', { email, otp, new_password: newPassword });
      setStep(3);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <h2>Forgot Password</h2>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          <button onClick={handleRequestOtp}>Request OTP</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Enter OTP and New Password</h2>
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" />
          <button onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}
      {step === 3 && <h2>Password reset successful!</h2>}
    </div>
  );
};

export default ForgotPassword;
