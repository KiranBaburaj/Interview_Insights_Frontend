// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { role } = useSelector((state) => state.auth);

  if (!role || role !== roleRequired) {
    // Redirect to login if user is not authenticated or does not have the required role
    return <Navigate to="/login" />;
  }

  // Render the children components if the user has the required role
  return children;
};

export default ProtectedRoute;
