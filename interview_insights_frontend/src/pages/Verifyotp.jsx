import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOTPAndSignup, clearError } from '../features/auth/authSlice';

const VerifyOTP = () => {
  const [otp, setOTP] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

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
      navigate('/signup-success');
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <form onSubmit={handleVerifyOTP}>
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
      {error && <p>{JSON.stringify(error)}</p>}
    </div>
  );
};

export default VerifyOTP;
