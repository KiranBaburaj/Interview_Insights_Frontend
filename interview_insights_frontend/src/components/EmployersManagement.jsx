import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEmployers,
  selectAllEmployers,
  selectEmployerError,
} from '../features/employer/employerSlice';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const EmployerManagement = () => {
  const dispatch = useDispatch();
  const employers = useSelector(selectAllEmployers);
  const error = useSelector(selectEmployerError);

  useEffect(() => {
    dispatch(fetchEmployers());
  }, [dispatch]);

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Employers</Typography>

      <List>
        {employers.map((employer) => (
          <ListItem key={employer.user.id} sx={{ borderBottom: '1px solid #ccc', flexDirection: 'column', alignItems: 'flex-start' }}>
            <ListItemText
              primary={`${employer.user.full_name} (${employer.company_name})`}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary">
                    Email: {employer.user.email}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textPrimary">
                    Company Name: {employer.company_name}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textPrimary">
                    Company Address: {employer.company_address}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textPrimary">
                    Phone: {employer.phone_number}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textPrimary">
                    Website: {employer.website_url}
                  </Typography>
                </>
              }
              sx={{ flex: '1 1 auto' }}
            />
          </ListItem>
        ))}
      </List>
      {error && <Typography color="error">Error loading employers: {error}</Typography>}
    </Box>
  );
};

export default EmployerManagement;
