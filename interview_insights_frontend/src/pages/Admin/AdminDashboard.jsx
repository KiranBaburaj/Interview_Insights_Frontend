// src/pages/AdminDashboard/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobSeekers, fetchEmployers, fetchRecruiters } from '../../features/auth/authSlice';
import Logout from '../../components/Logout';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { jobSeekers, employers, recruiters, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchJobSeekers());
    dispatch(fetchEmployers());
    dispatch(fetchRecruiters());
  }, [dispatch]);

  return (
    <div>
      <Logout />
      <h2>Admin Dashboard</h2>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <h3>Job Seekers</h3>
      <ul>
        {jobSeekers.length > 0 ? (
          jobSeekers.map((jobSeeker) => (
            <li key={jobSeeker.user?.email}>{jobSeeker.user?.email || 'No email available'}</li>
          ))
        ) : (
          <li>No job seekers found</li>
        )}
      </ul>

      <h3>Employers</h3>
      <ul>
        {employers.length > 0 ? (
          employers.map((employer) => (
            <li key={employer.user?.email}>{employer.user?.email || 'No email available'}</li>
          ))
        ) : (
          <li>No employers found</li>
        )}
      </ul>

      <h3>Recruiters</h3>
      <ul>
        {recruiters.length > 0 ? (
          recruiters.map((recruiter) => (
            <li key={recruiter.user?.email}>{recruiter.user?.email || 'No email available'}</li>
          ))
        ) : (
          <li>No recruiters found</li>
        )}
      </ul>
    </div>
  );
};

export default AdminDashboard;
