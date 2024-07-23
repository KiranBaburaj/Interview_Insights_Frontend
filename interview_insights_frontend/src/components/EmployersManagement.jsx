import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmployers,
  addEmployer,
  removeEmployer,
  editEmployer,
  selectAllEmployers,
  selectEmployerError,
} from '../features/employer/employerSlice';
import { Box, Typography, Button, List, ListItem, ListItemText, TextField } from '@mui/material';

const EmployerManagement = () => {
  const dispatch = useDispatch();
  const employers = useSelector(selectAllEmployers);
  const error = useSelector(selectEmployerError);
  const [editingEmployer, setEditingEmployer] = useState(null);
  const [formData, setFormData] = useState({ email: '', company_name: '' });

  useEffect(() => {
    dispatch(fetchEmployers());
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this employer?");
    if (confirmed) {
      console.log("Deleting Employer with ID:", id);  // Debugging line
      if (id) {
        dispatch(removeEmployer(id));
      } else {
        console.error("Employer ID is undefined");
      }
    }
  };

  const handleEditClick = (employer) => {
    setEditingEmployer(employer.user.id);
    setFormData({ email: employer.user.email, company_name: employer.company_name });
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
    if (editingEmployer) {
      dispatch(editEmployer({ id: editingEmployer, data: formData })).then(() => {
        setEditingEmployer(null);
        setFormData({ email: '', company_name: '' });
      });
    } else {
      dispatch(addEmployer(formData)).then(() => {
        setFormData({ email: '', company_name: '' });
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Employers</Typography>
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
          name="company_name"
          label="Company Name"
          value={formData.company_name}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
        />
        <Button type="submit" variant="contained" color="primary">
          {editingEmployer ? 'Save' : 'Create'}
        </Button>
        {editingEmployer && (
          <Button onClick={() => setEditingEmployer(null)} variant="outlined" color="secondary">
            Cancel
          </Button>
        )}
      </Box>
      <List>
        {employers.map((employer) => (
          <ListItem key={employer.user.id} sx={{ borderBottom: '1px solid #ccc' }}>
            {editingEmployer === employer.user.id ? (
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
                  name="company_name"
                  label="Company Name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
                <Button onClick={() => setEditingEmployer(null)} variant="outlined" color="secondary">
                  Cancel
                </Button>
              </Box>
            ) : (
              <>
                <ListItemText
                  primary={`${employer.company_name}`}
                  secondary={employer.user.email}
                  sx={{ flex: '1 1 auto' }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button onClick={() => handleEditClick(employer)} variant="outlined" color="secondary">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(employer.user.id)} variant="outlined" color="error">
                    Delete
                  </Button>
                </Box>
              </>
            )}
          </ListItem>
        ))}
      </List>
      {error && <Typography color="error">Error loading employers: {error}</Typography>}
    </Box>
  );
};

export default EmployerManagement;
