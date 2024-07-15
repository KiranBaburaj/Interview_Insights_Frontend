// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { role } = useSelector((state) => state.auth);

  if (role !== roleRequired) {
    // Redirect to login if user is not an admin
    return <Navigate to="/login" />;
  }

  // Render the children components if the user is an admin
  return children;
};

export default ProtectedRoute;
