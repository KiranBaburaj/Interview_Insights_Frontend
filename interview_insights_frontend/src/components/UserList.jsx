// src/components/UserList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, removeUser } from '../features/users/userSlice';
import { Link } from 'react-router-dom';

const UserList = () => {
  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(removeUser(id));
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error loading users</div>;

  return (
    <div>
      <h1>User List</h1>
      <Link to="/create-user">Create New User</Link>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.email} - {user.full_name}
            <Link to={`/edit-user/${user.id}`}>Edit</Link>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
