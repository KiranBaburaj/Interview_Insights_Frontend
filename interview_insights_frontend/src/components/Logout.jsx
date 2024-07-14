import React from 'react';
import { useDispatch } from 'react-redux';
import { clearError } from '../features/auth/authSlice';

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear any error state in Redux store (optional)
    dispatch(clearError());

    // Clear tokens from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Redirect or perform any other actions after logout
    // Example: Redirect to login page
    window.location.replace('/login');
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
