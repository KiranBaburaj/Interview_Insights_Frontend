import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobSeekers, addJobSeeker, removeJobSeeker, editJobSeeker, selectAllJobSeekers, selectJobSeekerError } from '../features/jobseeker/jobseekerSlice';
import { Box, Typography, Button, List, ListItem, ListItemText, TextField } from '@mui/material';

const JobSeekerList = () => {
  const dispatch = useDispatch();
  const jobSeekers = useSelector(selectAllJobSeekers);
  const error = useSelector(selectJobSeekerError);
  const [editingJobSeeker, setEditingJobSeeker] = useState(null);
  const [formData, setFormData] = useState({ email: '', full_name: '' });

  useEffect(() => {
    dispatch(fetchJobSeekers());
  }, [dispatch]);

  const handleDelete = (id) => {
    console.log("Deleting Job Seeker with ID:", id);  // Debugging line
    if (id) {
      dispatch(removeJobSeeker(id));
    } else {
      console.error("Job seeker ID is undefined");
    }
  };

  const handleEditClick = (jobSeeker) => {
    setEditingJobSeeker(jobSeeker.user.id);
    setFormData({ email: jobSeeker.user.email, full_name: jobSeeker.user.full_name });
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
    if (editingJobSeeker) {
      dispatch(editJobSeeker({ id: editingJobSeeker, data: formData })).then(() => {
        setEditingJobSeeker(null);
        setFormData({ email: '', full_name: '' });
      });
    } else {
      dispatch(addJobSeeker(formData)).then(() => {
        setFormData({ email: '', full_name: '' });
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Job Seekers</Typography>
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
          {editingJobSeeker ? 'Save' : 'Create'}
        </Button>
        {editingJobSeeker && (
          <Button onClick={() => setEditingJobSeeker(null)} variant="outlined" color="secondary">
            Cancel
          </Button>
        )}
      </Box>
      <List>
        {jobSeekers.map((jobSeeker) => (
          <ListItem key={jobSeeker.user.id} sx={{ borderBottom: '1px solid #ccc' }}>
            {editingJobSeeker === jobSeeker.user.id ? (
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
                  name="email"
                  label="Email"
                  value={formData.id}
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
                <Button onClick={() => setEditingJobSeeker(null)} variant="outlined" color="secondary">
                  Cancel
                </Button>
              </Box>
            ) : (
              <>
                <ListItemText
                  primary={jobSeeker.user.id}
                  secondary={jobSeeker.user.full_name}
                  sx={{ flex: '1 1 auto' }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button onClick={() => handleEditClick(jobSeeker)} variant="outlined" color="secondary">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(jobSeeker.user.id)} variant="outlined" color="error">
                    Delete
                  </Button>
                </Box>
              </>
            )}
          </ListItem>
        ))}
      </List>
      {error && <Typography color="error">Error loading job seekers: {error}</Typography>}
    </Box>
  );
};

export default JobSeekerList;
