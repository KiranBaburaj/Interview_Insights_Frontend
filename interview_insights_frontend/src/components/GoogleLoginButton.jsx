import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { googleLogin } from '../features/auth/authSlice';

// Placeholder icons (replace with your actual logo/image URLs)
const jobSeekerIcon = '👩‍💻'; // Replace with your Job Seeker logo
const employerIcon = '🏢';   // Replace with your Employer logo

function GoogleLoginButton() {
  const [role, setRole] = useState('jobseeker');
  const dispatch = useDispatch();

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleGoogleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    dispatch(googleLogin({
      access_token: credentialResponse.credential,
      role: role,
    }));
  };

  // Inline styles
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    roleSelection: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      maxWidth: '400px',
      marginBottom: '20px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '10px',
      backgroundColor: '#f9f9f9',
    },
    radioLabel: {
      flex: 1,
      textAlign: 'center',
      padding: '10px',
      cursor: 'pointer',
      borderRadius: '8px',
      transition: 'background 0.3s, color 0.3s',
    },
    radioInput: {
      display: 'none', // Hide the default radio button
    },
    selected: {
      backgroundColor: '#4285F4',
      color: 'white',
    },
    icon: {
      fontSize: '24px', // Adjust icon size
      marginRight: '8px', // Space between icon and text
    },
    googleLoginBtn: {
      width: '400px',
      height: '50px',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#4285F4',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background 0.3s',
    },
    googleLoginBtnHover: {
      backgroundColor: '#357ae8',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.roleSelection}>
        <label
          style={{ ...styles.radioLabel, ...(role === 'jobseeker' ? styles.selected : {}) }}
          onClick={() => setRole('jobseeker')}
        >
          <span style={styles.icon}>{jobSeekerIcon}</span>
          Job Seeker
        </label>
        <label
          style={{ ...styles.radioLabel, ...(role === 'employer' ? styles.selected : {}) }}
          onClick={() => setRole('employer')}
        >
          <span style={styles.icon}>{employerIcon}</span>
          Employer
        </label>
      </div>
      <GoogleLogin
        onSuccess={handleGoogleLoginSuccess}
        onError={() => console.log('Login Failed')}
        style={styles.googleLoginBtn}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.googleLoginBtnHover.backgroundColor}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.googleLoginBtn.backgroundColor}
      >
        Sign in with Google
      </GoogleLogin>
    </div>
  );
}

export default GoogleLoginButton;