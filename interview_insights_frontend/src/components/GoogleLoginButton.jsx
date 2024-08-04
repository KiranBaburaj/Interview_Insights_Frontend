import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { googleLogin } from '../features/auth/authSlice';

function GoogleLoginButton() {
  const [role, setRole] = useState('');
  const dispatch = useDispatch();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);

    // Dispatch the googleLogin thunk
    dispatch(googleLogin({
      access_token: credentialResponse.credential,
      role: role,
    }));
  };

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            value="jobseeker"
            checked={role === 'jobseeker'}
            onChange={handleRoleChange}
          />
          Job Seeker
        </label>
        <label>
          <input
            type="radio"
            value="employer"
            checked={role === 'employer'}
            onChange={handleRoleChange}
          />
          Employer
        </label>
        <label>
          <input
            type="radio"
            value="recruiter"
            checked={role === 'recruiter'}
            onChange={handleRoleChange}
          />
          Recruiter
        </label>
      </div>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={() => console.log('Login Failed')}
      />
    </div>
  );
}

export default GoogleLoginButton;
