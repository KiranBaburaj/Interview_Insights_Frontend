import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmployers,
  selectAllEmployers,
  selectEmployerError,
} from '../features/employer/employerSlice';
import { Box, Typography, List, ListItem, ListItemText, Avatar, Divider } from '@mui/material';
import { Business } from '@mui/icons-material';

const EmployerManagement = () => {
  const dispatch = useDispatch();
  const employers = useSelector(selectAllEmployers);
  const error = useSelector(selectEmployerError);

  useEffect(() => {
    dispatch(fetchEmployers());
  }, [dispatch]);

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
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
      {error && <Typography color="error">Error loading employers: {error}</Typography>}
    </Box>
  );
};

export default EmployerManagement;
