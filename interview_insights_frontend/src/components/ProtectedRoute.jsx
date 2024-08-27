// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, roleRequired, checkCompanyDetails }) => {
  const { role, companyDetailsSubmitted } = useSelector((state) => state.auth);

  console.log(companyDetailsSubmitted)

  if (!role || role !== roleRequired) {
    // Redirect to login if user is not authenticated or does not have the required role
    return <Navigate to="/login" />;
  }

  if (checkCompanyDetails && !companyDetailsSubmitted) {
    console.log(companyDetailsSubmitted)
    // Redirect to company details form if the company details have not been submitted
    return <Navigate to="/EmployerCompanyManagement" />;
  }

  // Render the children components if the user has the required role and company details are submitted (if checked)
  return children;
};

export default ProtectedRoute;
