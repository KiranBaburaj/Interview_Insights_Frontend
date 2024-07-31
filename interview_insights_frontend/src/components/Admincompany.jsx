import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies, toggleCompanyApproval } from '../features/company/companySlice';
import { Box, Typography, Button, List, ListItem, ListItemText, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid } from '@mui/material';

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

  const renderDetailItem = (label, value) => (
    <Grid item xs={12}>
      <Typography variant="body1">
        <strong>{label}:</strong> {value || 'N/A'}
      </Typography>
    </Grid>
  );

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>

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

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Company Details</DialogTitle>
        <DialogContent>
          {selectedCompany ? (
            <Grid container spacing={2}>
              {renderDetailItem('Name', selectedCompany.name)}
              {renderDetailItem('Status', selectedCompany.is_approved ? 'Approved' : 'Not Approved')}
              {renderDetailItem('Logo URL', selectedCompany.logo_url)}
              {renderDetailItem('Website', selectedCompany.website_url)}
              {renderDetailItem('Industry', selectedCompany.industry)}
              {renderDetailItem('Company Size', selectedCompany.company_size)}
              {renderDetailItem('Founded Date', selectedCompany.founded_date)}
              {renderDetailItem('Description', selectedCompany.description)}
              {renderDetailItem('Headquarters', selectedCompany.headquarters_location)}
              {renderDetailItem('Employee Count', selectedCompany.employee_count)}
              {renderDetailItem('Tech Stack', JSON.stringify(selectedCompany.tech_stack))}
              {renderDetailItem('GST Document', selectedCompany.gst_document ? 'Uploaded' : 'Not uploaded')}
              {renderDetailItem('Created At', new Date(selectedCompany.created_at).toLocaleString())}
              {renderDetailItem('Updated At', new Date(selectedCompany.updated_at).toLocaleString())}
              
              <Grid item xs={12}>
                <Typography variant="h6">Locations</Typography>
                {selectedCompany.locations && selectedCompany.locations.map((location, index) => (
                  <Typography key={index} variant="body2">{location.location}</Typography>
                ))}
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6">Social Links</Typography>
                {selectedCompany.social_links && selectedCompany.social_links.map((link, index) => (
                  <Typography key={index} variant="body2">{link.platform}: {link.url}</Typography>
                ))}
              </Grid>
            </Grid>
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