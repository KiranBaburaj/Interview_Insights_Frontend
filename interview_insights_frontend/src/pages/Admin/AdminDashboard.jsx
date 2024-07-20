import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobSeekers, fetchEmployers, fetchRecruiters } from '../../features/auth/authSlice';
import { fetchCompanies, approveCompany } from '../../features/company/companySlice';
import AdminNavbar from './AdminNavbar';
import {
  Typography,
  CircularProgress,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Box,
  Link,
  CssBaseline,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UserList from '../../components/UserList';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { jobSeekers, employers, recruiters, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { companies, status: companyStatus, error: companyError } = useSelector((state) => state.company);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    dispatch(fetchJobSeekers());
    dispatch(fetchEmployers());
    dispatch(fetchRecruiters());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleApprove = (companyId) => {
    dispatch(approveCompany(companyId));
  };

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
  };

  const handleBackToList = () => {
    setSelectedCompany(null);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AdminNavbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Admin Dashboard
        </Typography>

        {(authLoading || companyStatus === 'loading') && <CircularProgress />}
        {(authError || companyError) && (
          <Alert severity="error">
            {authError ? authError : companyError.message}
          </Alert>
        )}

        {!selectedCompany ? (
          <Box><UserList/>
            <Typography variant="h5">Job Seekers</Typography>
            <List>
              {jobSeekers.length > 0 ? (
                jobSeekers.map((jobSeeker) => (
                  <ListItem key={jobSeeker.user?.email}>
                    <ListItemText primary={jobSeeker.user?.email || 'No email available'} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No job seekers found" />
                </ListItem>
              )}
            </List>

            <Typography variant="h5">Employers</Typography>
            <List>
              {employers.length > 0 ? (
                employers.map((employer) => (
                  <ListItem key={employer.user?.email}>
                    <ListItemText primary={employer.user?.email || 'No email available'} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No employers found" />
                </ListItem>
              )}
            </List>

            <Typography variant="h5">Recruiters</Typography>
            <List>
              {recruiters.length > 0 ? (
                recruiters.map((recruiter) => (
                  <ListItem key={recruiter.user?.email}>
                    <ListItemText primary={recruiter.user?.email || 'No email available'} />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No recruiters found" />
                </ListItem>
              )}
            </List>

            <Typography variant="h5">Companies</Typography>
            <List>
              {companies.length > 0 ? (
                companies.map((company) => (
                  <ListItem key={company.id}>
                    <ListItemText
                      primary={company.name}
                      secondary={`Approved: ${company.is_approved ? 'Yes' : 'No'} - Employer: ${company.employer.user.email}`}
                    />
                    <ListItemSecondaryAction>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewDetails(company)}
                      >
                        View Details
                      </Button>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No companies found" />
                </ListItem>
              )}
            </List>
          </Box>
        ) : (
          <Box>
            <Typography variant="h5">Company Details</Typography>
            <Typography variant="body1">Name: {selectedCompany.name}</Typography>
            <Typography variant="body1">
              Logo URL:{' '}
              <Link href={selectedCompany.logo_url} target="_blank" rel="noopener noreferrer">
                {selectedCompany.logo_url}
              </Link>
            </Typography>
            <Typography variant="body1">
              Website URL:{' '}
              <Link href={selectedCompany.website_url} target="_blank" rel="noopener noreferrer">
                {selectedCompany.website_url}
              </Link>
            </Typography>
            <Typography variant="body1">Industry: {selectedCompany.industry}</Typography>
            <Typography variant="body1">Company Size: {selectedCompany.company_size}</Typography>
            <Typography variant="body1">Founded Date: {selectedCompany.founded_date}</Typography>
            <Typography variant="body1">Description: {selectedCompany.description}</Typography>
            <Typography variant="body1">Headquarters Location: {selectedCompany.headquarters_location}</Typography>
            <Typography variant="body1">Employee Count: {selectedCompany.employee_count}</Typography>
            <Typography variant="body1">Tech Stack: {selectedCompany.tech_stack}</Typography>
            <Typography variant="body1">
              GST Document:{' '}
              <Link href={selectedCompany.gst_document} target="_blank" rel="noopener noreferrer">
                View Document
              </Link>
            </Typography>
            <Typography variant="body1">Employer: {selectedCompany.employer.user.email}</Typography>
            {!selectedCompany.is_approved && (
              <Button variant="contained" color="primary" onClick={() => handleApprove(selectedCompany.id)}>
                Approve
              </Button>
            )}
            <Button variant="outlined" color="secondary" startIcon={<ArrowBackIcon />} onClick={handleBackToList}>
              Back to List
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
