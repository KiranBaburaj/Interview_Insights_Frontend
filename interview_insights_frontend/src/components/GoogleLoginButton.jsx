// components/GoogleLoginComponent.jsx

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { googleLogin } from '../features/auth/authSlice';

const GoogleLoginComponent = () => {
  const dispatch = useDispatch();

  const handleLoginSuccess = async (response) => {
    try {
      console.log('Login Success:', response);

      // Assuming @react-oauth/google provides idToken and accessToken in response
      const backendResponse = await axios.post('/api/google-login/', {
        idToken: response.idToken,
        accessToken: response.accessToken,
        // Other relevant data as needed by your backend
      });

      // Dispatch action to store tokens in Redux store
      dispatch(googleLogin(backendResponse.data));
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLoginFailure = (response) => {
    console.log('Login Failed:', response);
    // Handle login failure if needed
  };

  return (
    <GoogleLogin
      clientId="678111264994-o1ccqt38dekda04159f1aggbdq9n5c0e.apps.googleusercontent.com" // Replace with your actual Google OAuth2 client ID
      onSuccess={handleLoginSuccess}
      onFailure={handleLoginFailure}
      buttonText="Login with Google"
    />
  );
};

export default GoogleLoginComponent;

