import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmployers,
  removeEmployer,
  selectAllEmployers,
  selectEmployerError,
} from '../features/employer/employerSlice';
import { Box, Typography, List, ListItem, ListItemText, Avatar, Divider, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Business } from '@mui/icons-material';

const EmployerManagement = () => {
  const dispatch = useDispatch();
  const employers = useSelector(selectAllEmployers);
  const error = useSelector(selectEmployerError);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedEmployerId, setSelectedEmployerId] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployers());
  }, [dispatch]);

  const handleDeleteClick = (id) => {
    setSelectedEmployerId(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedEmployerId) {
      dispatch(removeEmployer(selectedEmployerId)).then(() => {
        dispatch(fetchEmployers());
      });
    }
    setConfirmDialogOpen(false);
    setSelectedEmployerId(null);
  };

  const handleCloseDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedEmployerId(null);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
      <List>
        {employers.map((employer) => (
          <React.Fragment key={employer.user.id}>
            <ListItem sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                <Business fontSize="large" />
              </Avatar>
              <ListItemText
                primary={<Typography variant="h6">{employer.user.full_name}</Typography>}
                secondary={`Email: ${employer.user.email}`}
                sx={{ flex: '1 1 auto' }}
              />
              <Button variant="contained" color="error" onClick={() => handleDeleteClick(employer.user.id)}>
                Delete
              </Button>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      {error && <Typography color="error">Error loading employers: {error}</Typography>}

      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this employer? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployerManagement;
