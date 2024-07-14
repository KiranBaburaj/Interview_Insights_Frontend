// AdminDashboard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAdminData } from '../../features/auth/authSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminData());
  }, [dispatch]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{JSON.stringify(error)}</p>
      ) : (
        <div>
          <p>Welcome, {user.full_name}</p>
          <p>Email: {user.email}</p>
          {/* Additional admin-specific data */}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
