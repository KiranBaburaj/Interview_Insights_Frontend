import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
} from '@mui/material';
import EmployerNavbar from '../../components/EmployerNavbar';
import { AccessTime, WorkOutline, CalendarToday as CalendarTodayIcon } from '@mui/icons-material';
import { fetchJobs, selectAllJobs } from '../../features/jobs/jobsSlice';
import { fetchApplicants } from '../../features/applicants/applicantsSlice';
import { DateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const EmployerDashboard = () => {
  const dispatch = useDispatch();
  const [applicantsFetched, setApplicantsFetched] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);

  // Fetch jobs and applicants from the Redux store
  const jobs = useSelector(selectAllJobs);
  const applicants = useSelector((state) => state.applicants.applicants);
  const jobsStatus = useSelector((state) => state.jobs.status);
  const applicantsStatus = useSelector((state) => state.applicants.status);
  const { user } = useSelector((state) => state.auth);
  const { full_name } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    if (jobs.length > 0 && !applicantsFetched) {
      jobs.forEach(job => {
        dispatch(fetchApplicants(job.id));
      });
      setApplicantsFetched(true);
    }
  }, [dispatch, jobs, applicantsFetched]);

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // Filter jobs and applicants based on selected date range
  const filteredJobs = jobs.filter((job) => {
    const postedDate = dayjs(job.posted_at);
    return (
      (!dateRange[0] || postedDate.isAfter(dayjs(dateRange[0]).subtract(1, 'day'))) &&
      (!dateRange[1] || postedDate.isBefore(dayjs(dateRange[1]).add(1, 'day')))
    );
  });

  const filteredApplicants = applicants.filter((applicant) => {
    const appliedDate = dayjs(applicant.applied_at);
    return (
      (!dateRange[0] || appliedDate.isAfter(dayjs(dateRange[0]).subtract(1, 'day'))) &&
      (!dateRange[1] || appliedDate.isBefore(dayjs(dateRange[1]).add(1, 'day')))
    );
  });

  const totalJobsPosted = filteredJobs.length;
  const applicationsReceived = filteredApplicants.length;

  if (jobsStatus === 'loading' || applicantsStatus === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <EmployerNavbar />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
        >
          <Toolbar />

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Welcome, {user ? full_name : 'Employer'}
            </Typography>
            <Box display="flex" alignItems="center">
              <CalendarTodayIcon />
              <DateRangePicker
                sx={{ mx: 2 }}
                startText="Start"
                endText="End"
                value={dateRange}
                onChange={handleDateChange}
              />
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={3}>
            <Paper sx={{ p: 2, textAlign: 'center', flex: 1, mr: 2 }}>
              <Typography variant="h6">Total Jobs Posted</Typography>
              <Typography variant="h4">{totalJobsPosted}</Typography>
            </Paper>
            <Paper sx={{ p: 2, textAlign: 'center', flex: 1 }}>
              <Typography variant="h6">Applications Received</Typography>
              <Typography variant="h4">{applicationsReceived}</Typography>
            </Paper>
          </Box>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Jobs Posted
            </Typography>
            <List>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <ListItem key={job.id} divider>
                    <ListItemText
                      primary={job.title}
                      secondary={`Posted on: ${new Date(job.posted_at).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>No jobs posted within the selected date range.</Typography>
              )}
            </List>
          </Paper>

          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Applications Received
            </Typography>
            <List>
              {filteredApplicants.length > 0 ? (
                filteredApplicants.map((applicant) => (
                  <ListItem key={applicant.id} divider>
                    <Avatar
                      alt={applicant.job_seeker?.user?.full_name || "Unknown"}
                      src={applicant.job_seeker?.profile_photo ? `http://localhost:8000${applicant.job_seeker.profile_photo}` : undefined}
                    />
                    <ListItemText
                      primary={`Applicant: ${applicant.job_seeker?.user?.full_name || "Unknown"}`}
                      secondary={`Applied on: ${new Date(applicant.applied_at).toLocaleDateString()}`}
                      sx={{ marginLeft: 2 }}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>No applications received within the selected date range.</Typography>
              )}
            </List>
          </Paper>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default EmployerDashboard;
