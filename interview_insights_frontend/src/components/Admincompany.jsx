import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies, toggleCompanyApproval } from '../features/company/companySlice';
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

const CompanyList = () => {
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.company.companies);
  const status = useSelector((state) => state.company.status);
  const error = useSelector((state) => state.company.error);
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleToggleApproval = (id) => {
    dispatch(toggleCompanyApproval({ id }));
  };

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCompany(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Companies</Typography>
      {status === 'loading' && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <List>
        {companies.map((company) => (
          <ListItem key={company.id} sx={{ borderBottom: '1px solid #ccc' }}>
            <ListItemText
              primary={company.name}
              secondary={`Status: ${company.is_approved ? 'Approved' : 'Not Approved'}`}
              sx={{ flex: '1 1 auto' }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={() => handleViewDetails(company)} variant="outlined" color="primary">
                View Details
              </Button>
              <Button onClick={() => handleToggleApproval(company.id)} variant="outlined" color="warning">
                {company.is_approved ? 'Disapprove' : 'Approve'}
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Company Details</DialogTitle>
        <DialogContent>
          {selectedCompany ? (
            <DialogContentText>
              <strong>Name:</strong> {selectedCompany.name}<br />
              <strong>Status:</strong> {selectedCompany.is_approved ? 'Approved' : 'Not Approved'}<br />
              <strong>Created At:</strong> {new Date(selectedCompany.created_at).toLocaleString()}<br />
              <strong>Updated At:</strong> {new Date(selectedCompany.updated_at).toLocaleString()}
            </DialogContentText>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CompanyList;
