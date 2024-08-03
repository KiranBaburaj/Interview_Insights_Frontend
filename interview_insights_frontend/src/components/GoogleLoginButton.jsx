import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function GoogleLoginButton() {
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    // Send the token to your backend
    const response = await fetch('http://localhost:8000/api/google/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: credentialResponse.credential,
      }),
    }); if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from backend:', errorData);
      return;
    }

    const data = await response.json();
    console.log('Response from backend:', data);

    // Store the JWT token received from your backend
    localStorage.setItem('token', data.access_token);
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLoginSuccess}
      onError={() => console.log('Login Failed')}
    />
  );
}


export default GoogleLoginButton;