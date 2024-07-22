// src/components/UserList.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, removeUser, editUser, selectAllUsers, selectUserStatus, selectUserError } from '../features/users/userSlice';
import { Box, Typography, Button, List, ListItem, ListItemText, TextField } from '@mui/material';

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', full_name: '' });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(removeUser(id));
  };

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setFormData({ email: user.email, full_name: user.full_name });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      dispatch(editUser({ id: editingUser, userData: formData })).then(() => {
        setEditingUser(null);
        setFormData({ email: '', full_name: '' });
      });
    } else {
      dispatch(addUser(formData)).then(() => {
        setFormData({ email: '', full_name: '' });
      });
    }
  };

  if (status === 'loading') return <Typography>Loading...</Typography>;
  if (status === 'failed') return <Typography>Error loading users: {error}</Typography>;

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>User List</Typography>
      <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
        />
        <TextField
          name="full_name"
          label="Full Name"
          value={formData.full_name}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
        />
        <Button type="submit" variant="contained" color="primary">
          {editingUser ? 'Save' : 'Create'}
        </Button>
        {editingUser && (
          <Button onClick={() => setEditingUser(null)} variant="outlined" color="secondary">
            Cancel
          </Button>
        )}
      </Box>
      <List>
        {users.map((user) => (
          <ListItem key={user.id} sx={{ borderBottom: '1px solid #ccc' }}>
            {editingUser === user.id ? (
              <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
                <TextField
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                />
                <TextField
                  name="full_name"
                  label="Full Name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
                <Button onClick={() => setEditingUser(null)} variant="outlined" color="secondary">
                  Cancel
                </Button>
              </Box>
            ) : (
              <>
                <ListItemText
                  primary={user.email}
                  secondary={user.full_name}
                  sx={{ flex: '1 1 auto' }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button onClick={() => handleEditClick(user)} variant="outlined" color="secondary">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(user.id)} variant="outlined" color="error">
                    Delete
                  </Button>
                </Box>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserList;
