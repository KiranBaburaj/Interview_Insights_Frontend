import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobSeekers, fetchEmployers, fetchRecruiters } from '../../features/auth/authSlice';
import { fetchCompanies, approveCompany } from '../../features/company/companySlice';
import { fetchJobs } from '../../features/jobs/jobsSlice'; // Import the fetchJobs action
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
} from '@mui/material';
import { DateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { jobSeekers, employers, recruiters, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { companies, status: companyStatus, error: companyError } = useSelector((state) => state.company);
  const { jobs, status: jobStatus, error: jobError } = useSelector((state) => state.jobs); // Select jobs from the store
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null); // State to control which job is expanded
  const [dateRange, setDateRange] = useState([null, null]); // State to manage the date range

  useEffect(() => {
    dispatch(fetchJobSeekers());
    dispatch(fetchEmployers());
    dispatch(fetchRecruiters());
    dispatch(fetchCompanies());
    dispatch(fetchJobs()); // Fetch jobs when the dashboard loads
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
    setExpandedJob(expandedJob === jobId ? null : jobId); // Toggle job expansion
  };

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // Filter jobs based on the selected date range
  const filteredJobs = jobs.filter((job) => {
    const postedDate = dayjs(job.posted_at);
    return (
      (!dateRange[0] || postedDate.isAfter(dayjs(dateRange[0]).subtract(1, 'day'))) &&
      (!dateRange[1] || postedDate.isBefore(dayjs(dateRange[1]).add(1, 'day')))
    );
  });

  // Filter job seekers based on the selected date range
  const filteredJobSeekers = jobSeekers.filter((jobSeeker) => {
    const createdDate = dayjs(jobSeeker.created_at); // Assuming jobSeeker has a created_at field
    return (
      (!dateRange[0] || createdDate.isAfter(dayjs(dateRange[0]).subtract(1, 'day'))) &&
      (!dateRange[1] || createdDate.isBefore(dayjs(dateRange[1]).add(1, 'day')))
    );
  });

  // Filter employers based on the selected date range
  const filteredEmployers = employers.filter((employer) => {
    const createdDate = dayjs(employer.created_at); // Assuming employer has a created_at field
    return (
      (!dateRange[0] || createdDate.isAfter(dayjs(dateRange[0]).subtract(1, 'day'))) &&
      (!dateRange[1] || createdDate.isBefore(dayjs(dateRange[1]).add(1, 'day')))
    );
  });

  // Filter companies based on the selected date range
  const filteredCompanies = companies.filter((company) => {
    const createdDate = dayjs(company.created_at); // Assuming company has a created_at field
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
          <Typography variant="h4" align="center" gutterBottom>
            Admin Dashboard
          </Typography>

          {/* Date Range Picker for Filtering All Entities */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" sx={{ mt: 4 }}>
              Filter by Date
            </Typography>
            <DateRangePicker
              startText="Start"
              endText="End"
              value={dateRange}
              onChange={handleDateChange}
              renderInput={(startProps, endProps) => (
                <Box display="flex" alignItems="center">
                  <TextField {...startProps} sx={{ mx: 1 }} />
                  <TextField {...endProps} sx={{ mx: 1 }} />
                </Box>
              )}
            />
          </Box>

          {/* Summary Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Job Seekers</Typography>
                  <Typography variant="h4">{filteredJobSeekers.length}</Typography>
                  <Divider sx={{ my: 2 }} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Employers</Typography>
                  <Typography variant="h4">{filteredEmployers.length}</Typography>
                  <Divider sx={{ my: 2 }} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Recruiters</Typography>
                  <Typography variant="h4">{recruiters.length}</Typography>
                  <Divider sx={{ my: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Company Approvals Section */}
          <Typography variant="h5" sx={{ mt: 4 }}>
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
                    >
                      Approve
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    onClick={() => handleViewDetails(company)}
                    sx={{ ml: 1 }}
                  >
                    View Details
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {/* Job Listings Section */}
          <Typography variant="h5" sx={{ mt: 4 }}>
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
                      secondary={`Company: ${job.company.name} | Applications: ${job.applications_count} | Posted on: ${new Date(job.posted_at).toLocaleDateString()}`}
                    />
                  </ListItem>
                  <Collapse in={expandedJob === job.id} timeout="auto" unmountOnExit>
                    <Box sx={{ pl: 4 }}>
                      <Typography variant="body2"><strong>Description:</strong> {job.description}</Typography>
                      <Typography variant="body2"><strong>Responsibilities:</strong> {job.responsibilities}</Typography>
                      <Typography variant="body2"><strong>Qualifications:</strong> {job.qualifications}</Typography>
                      <Typography variant="body2"><strong>Salary:</strong> ${job.salary_min} - ${job.salary_max}</Typography>
                      <Typography variant="body2"><strong>Location:</strong> {job.location}</Typography>
                      <Typography variant="body2"><strong>Application Deadline:</strong> {new Date(job.application_deadline).toLocaleDateString()}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <ListItemSecondaryAction>
                        <Button variant="outlined" onClick={() => {/* Implement edit functionality */}}>
                          Edit
                        </Button>
                        <Button variant="contained" color="secondary" sx={{ ml: 1 }} onClick={() => {/* Implement delete functionality */}}>
                          Delete
                        </Button>
                      </ListItemSecondaryAction>
                    </Box>
                  </Collapse>
                </div>
              ))}
              {filteredJobs.length === 0 && (
                <Typography>No jobs posted within the selected date range.</Typography>
              )}
            </List>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AdminDashboard;