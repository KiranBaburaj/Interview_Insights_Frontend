import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobSeekers, fetchEmployers, fetchRecruiters } from '../../features/auth/authSlice';
import { fetchCompanies, approveCompany } from '../../features/company/companySlice';
import { fetchJobs } from '../../features/jobs/jobsSlice';
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
  CssBaseline,
  Grid,
  Card,
  CardContent,
  Divider,
  Collapse,
  Paper,
  TextField,
} from '@mui/material';
import { DateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { jobSeekers, employers, recruiters, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { companies, status: companyStatus, error: companyError } = useSelector((state) => state.company);
  const { jobs, status: jobStatus, error: jobError } = useSelector((state) => state.jobs);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    dispatch(fetchJobSeekers());
    dispatch(fetchEmployers());
    dispatch(fetchRecruiters());
    dispatch(fetchCompanies());
    dispatch(fetchJobs());
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

  const handleExpandJob = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const filteredJobs = jobs.filter((job) => {
    const postedDate = dayjs(job.posted_at);
    return (
      (!dateRange[0] || postedDate.isAfter(dayjs(dateRange[0]).subtract(1, 'day'))) &&
      (!dateRange[1] || postedDate.isBefore(dayjs(dateRange[1]).add(1, 'day')))
    );
  });

  const filteredJobSeekers = jobSeekers.filter((jobSeeker) => {
    const createdDate = dayjs(jobSeeker.created_at);
    return (
      (!dateRange[0] || createdDate.isAfter(dayjs(dateRange[0]).subtract(1, 'day'))) &&
      (!dateRange[1] || createdDate.isBefore(dayjs(dateRange[1]).add(1, 'day')))
    );
  });

  const filteredEmployers = employers.filter((employer) => {
    const createdDate = dayjs(employer.created_at);
    return (
      (!dateRange[0] || createdDate.isAfter(dayjs(dateRange[0]).subtract(1, 'day'))) &&
      (!dateRange[1] || createdDate.isBefore(dayjs(dateRange[1]).add(1, 'day')))
    );
  });

  const filteredCompanies = companies.filter((company) => {
    const createdDate = dayjs(company.created_at);
    return (
      (!dateRange[0] || createdDate.isAfter(dayjs(dateRange[0]).subtract(1, 'day'))) &&
      (!dateRange[1] || createdDate.isBefore(dayjs(dateRange[1]).add(1, 'day')))
    );
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AdminNavbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" align="center" gutterBottom fontFamily="'Roboto', sans-serif">
            Admin Dashboard
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" sx={{ mt: 4 }} fontFamily="'Roboto', sans-serif">
              Filter by Date
            </Typography>
            <DateRangePicker
              startText="Start"
              endText="End"
              value={dateRange}
              onChange={handleDateChange}
              renderInput={(startProps, endProps) => (
                <Box display="flex" alignItems="center">
                  <TextField {...startProps} sx={{ mx: 1 }} variant="outlined" />
                  <TextField {...endProps} sx={{ mx: 1 }} variant="outlined" />
                </Box>
              )}
            />
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">Job Seekers</Typography>
                  <Typography variant="h4" color="primary">{filteredJobSeekers.length}</Typography>
                  <Divider sx={{ my: 2 }} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">Employers</Typography>
                  <Typography variant="h4" color="primary">{filteredEmployers.length}</Typography>
                  <Divider sx={{ my: 2 }} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">Companies</Typography>
                  <Typography variant="h4" color="primary">{filteredCompanies.length}</Typography>
                  <Divider sx={{ my: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h5" sx={{ mt: 4 }} fontFamily="'Roboto', sans-serif">
            Company Approvals
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            {filteredCompanies.map((company) => (
              <ListItem key={company.id}>
                <ListItemText
                  primary={company.name}
                  secondary={`Status: ${company.approved ? 'Approved' : 'Pending'}`}
                />
                <ListItemSecondaryAction>
                  {!company.approved && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleApprove(company.id)}
                      sx={{ mr: 1 }}
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    onClick={() => handleViewDetails(company)}
                  >
                    View Details
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Typography variant="h5" sx={{ mt: 4 }} fontFamily="'Roboto', sans-serif">
            Job Listings
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {jobStatus === 'loading' ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Loading Jobs...
              </Typography>
            </Box>
          ) : jobError ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {jobError}
            </Alert>
          ) : (
            <List>
              {filteredJobs.map((job) => (
                <div key={job.id}>
                  <ListItem button onClick={() => handleExpandJob(job.id)}>
                    <ListItemText
                      primary={job.title}
                      secondary={`Company: ${job.company.name} | Posted on: ${new Date(job.posted_at).toLocaleDateString()} | Status: ${job.status}`}
                    />
                  </ListItem>
                  <Collapse in={expandedJob === job.id} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4 }}>
                      <Typography variant="body2"><strong>Description:</strong> {job.description}</Typography>
                      <Typography variant="body2"><strong>Responsibilities:</strong> {job.responsibilities}</Typography>
                      <Typography variant="body2"><strong>Qualifications:</strong> {job.qualifications}</Typography>
                      <Typography variant="body2"><strong>Salary:</strong> ${job.salary_min} - ${job.salary_max}</Typography>
                      <Typography variant="body2"><strong>Location:</strong> {job.location}</Typography>
                      <Typography variant="body2"><strong>Type:</strong> {job.job_type}</Typography>
                      <Typography variant="body2"><strong>Job Status:</strong> {job.status}</Typography>
                    </Box>
                  </Collapse>
                  <Divider />
                </div>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AdminDashboard;