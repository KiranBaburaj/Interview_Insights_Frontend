import React from 'react';
import { useSelector } from 'react-redux';
import CompanyManagement from '../../components/companymanagement';

const EmployerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h1>Welcome, {user ? user.full_name : 'Employer'}</h1>
      <CompanyManagement/>
      {/* Display employer-specific components and features here */}
    </div>
  );
};

export default EmployerDashboard;
