import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobSeekers, toggleActiveStatus, selectAllJobSeekers, selectJobSeekerError, removeJobSeeker } from '../features/jobseeker/jobseekerSlice';
import { Box, Typography, Button, List, ListItem, ListItemText, Avatar, Divider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const JobSeekerList = () => {
  const dispatch = useDispatch();
  const jobSeekers = useSelector(selectAllJobSeekers);
  const error = useSelector(selectJobSeekerError);
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchJobSeekers());
  }, [dispatch]);

  const handleToggleActive = (id) => {
    dispatch(toggleActiveStatus(id));
  };

  const handleDeleteUser = async () => {
    if (selectedUserId !== null) {
      await dispatch(removeJobSeeker(selectedUserId));
      dispatch(fetchJobSeekers());
      handleClose();
    }
  };

  const handleClickOpen = (id) => {
    setSelectedUserId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUserId(null);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
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
              <Button onClick={() => handleClickOpen(jobSeeker.user.id)} variant="contained" color="secondary">
                Delete
              </Button>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      {error && <Typography color="error">Error loading job seekers: {error}</Typography>}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobSeekerList;
