import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobSeekers, toggleActiveStatus, selectAllJobSeekers, selectJobSeekerError } from '../features/jobseeker/jobseekerSlice';
import { Box, Typography, Button, List, ListItem, ListItemText, Avatar, Divider } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const JobSeekerList = () => {
  const dispatch = useDispatch();
  const jobSeekers = useSelector(selectAllJobSeekers);
  const error = useSelector(selectJobSeekerError);

  useEffect(() => {
    dispatch(fetchJobSeekers());
  }, [dispatch]);

  const handleToggleActive = (id) => {
    dispatch(toggleActiveStatus(id));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>Job Seekers</Typography>
      
      <List>
        {jobSeekers.map((jobSeeker) => (
          <React.Fragment key={jobSeeker.user.id}>
            <ListItem sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <AccountCircle fontSize="large" />
              </Avatar>
              <ListItemText
                primary={<Typography variant="h6">{jobSeeker.user.full_name}</Typography>}
                secondary={jobSeeker.user.email}
                sx={{ flex: '1 1 auto' }}
              />
              <Button onClick={() => handleToggleActive(jobSeeker.user.id)} variant="contained" color={jobSeeker.user.is_active ? 'success' : 'error'}>
                {jobSeeker.user.is_active ? 'Active' : 'Inactive'}
              </Button>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      {error && <Typography color="error">Error loading job seekers: {error}</Typography>}
    </Box>
  );
};

export default JobSeekerList;
