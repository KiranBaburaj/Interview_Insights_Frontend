import React from 'react';
import { useSelector } from 'react-redux';
import Logout from '../../components/Logout';

const JobseekerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h1>Welcome, {user ? user.full_name : 'Jobseeker'}</h1>
      {/* Display jobseeker-specific components and features here */}
      <Logout/>
    </div>
  );
};

export default JobseekerDashboard;
