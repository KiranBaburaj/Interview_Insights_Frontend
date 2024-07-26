import React from 'react';
import { useDispatch } from 'react-redux';
import { clearError, logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout initiated');
    
    // Clear any error state in Redux store (optional)
    dispatch(clearError());

    // Dispatch logout action to clear the state
    dispatch(logout());

    // Clear tokens from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');

    // Verify if tokens are removed
    console.log('AccessToken:', localStorage.getItem('accessToken'));
    console.log('RefreshToken:', localStorage.getItem('refreshToken'));
    console.log('Role:', localStorage.getItem('role'));

    // Redirect to login page
    navigate('/login');
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
