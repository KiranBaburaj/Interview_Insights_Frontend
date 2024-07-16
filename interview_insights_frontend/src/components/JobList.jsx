import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJobs, selectAllJobs } from '../features/jobs/jobsSlice';
import { Box, Typography, CircularProgress, List, ListItem, ListItemText } from '@mui/material';

const JobList = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Handle initial loading state or empty jobs array
  if (!Array.isArray(jobs)) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4">Jobs List</Typography>
        <CircularProgress />
      </Box>
    );
  }

  // Ensure jobs is an array before mapping over it
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Jobs List
      </Typography>
      <List>
        {jobs.map((job) => (
          <ListItem key={job.id}>
            <ListItemText primary={job.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default JobList;
