import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  CircularProgress,
  Grid,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom'; 
import EmployerNavbar from '../../components/EmployerNavbar';
import { CalendarToday as CalendarTodayIcon } from '@mui/icons-material';
import { ArrowForwardIos as ArrowForwardIosIcon } from '@mui/icons-material';
import { fetchJobs, selectAllJobs } from '../../features/jobs/jobsSlice';
import { fetchApplicants } from '../../features/applicants/applicantsSlice';
import { DateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const EmployerDashboard = () => {
  const dispatch = useDispatch();
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(true);
  const [aggregatedApplicants, setAggregatedApplicants] = useState({});
  const [dateRange, setDateRange] = useState([null, null]);
  const { user, userid: employerId } = useSelector((state) => state.auth);
  const { full_name } = useSelector((state) => state.auth);

  const jobs = useSelector(selectAllJobs);
  const jobsStatus = useSelector((state) => state.jobs.status);

  // Fetch jobs on component mount
  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Fetch and aggregate applicants for each job
  useEffect(() => {
    const fetchAndAggregateApplicants = async () => {
      if (jobs.length > 0) {
        setIsLoadingApplicants(true);
        const applicantsData = {};

        try {
          const fetchPromises = jobs.map(async (job) => {
            const response = await dispatch(fetchApplicants(job.id)).unwrap();
            applicantsData[job.id] = response;
          });

          await Promise.all(fetchPromises);
          setAggregatedApplicants(applicantsData);
        } catch (error) {
          console.error('Error fetching applicants:', error);
        }

        setIsLoadingApplicants(false);
      }
    };

    fetchAndAggregateApplicants();
  }, [dispatch, jobs]);

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // Show loading state while either jobs or applicants are loading
  if (jobsStatus === 'loading' || isLoadingApplicants) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const filteredJobs = jobs.filter((job) => {
    const postedDate = dayjs(job.posted_at);
    return (
      job.employer == employerId && 
      (!dateRange[0] || postedDate.isAfter(dayjs(dateRange[0]).subtract(1, 'day'))) &&
      (!dateRange[1] || postedDate.isBefore(dayjs(dateRange[1]).add(1, 'day')))
    );
  });

  // Get all applicants for filtered jobs
  const getAllFilteredApplicants = () => {
    const allApplicants = [];
    filteredJobs.forEach(job => {
      const jobApplicants = aggregatedApplicants[job.id] || [];
      jobApplicants.forEach(applicant => {
        const appliedDate = dayjs(applicant.applied_at);
        if (!dateRange[0] || appliedDate.isAfter(dayjs(dateRange[0]).subtract(1, 'day'))) {
          if (!dateRange[1] || appliedDate.isBefore(dayjs(dateRange[1]).add(1, 'day'))) {
            allApplicants.push({
              ...applicant,
              jobTitle: job.title,
              jobId: job.id
            });
          }
        }
      });
    });
    return allApplicants;
  };

  const filteredApplicants = getAllFilteredApplicants();
  const totalJobsPosted = filteredJobs.length;
  const applicationsReceived = filteredApplicants.length;

  // Calculate metrics for visualization
  const applicantMetrics = {
    totalApplications: applicationsReceived,
    applicationsByJob: {},
    applicationsByDate: {},
    statusDistribution: {
      pending: 0,
      reviewing: 0,
      interviewed: 0,
      accepted: 0,
      rejected: 0
    },
    skillsDistribution: {}
  };

  filteredApplicants.forEach(applicant => {
    // Count applications by job
    if (!applicantMetrics.applicationsByJob[applicant.jobTitle]) {
      applicantMetrics.applicationsByJob[applicant.jobTitle] = 0;
    }
    applicantMetrics.applicationsByJob[applicant.jobTitle]++;

    // Count applications by date
    const dateKey = dayjs(applicant.applied_at).format('YYYY-MM-DD');
    if (!applicantMetrics.applicationsByDate[dateKey]) {
      applicantMetrics.applicationsByDate[dateKey] = 0;
    }
    applicantMetrics.applicationsByDate[dateKey]++;

    // Count applications by status
    applicantMetrics.statusDistribution[applicant.status.toLowerCase()]++;

    // Count skills (if available)
    if (applicant.job_seeker?.skills) {
      applicant.job_seeker.skills.forEach(skill => {
        if (!applicantMetrics.skillsDistribution[skill]) {
          applicantMetrics.skillsDistribution[skill] = 0;
        }
        applicantMetrics.skillsDistribution[skill]++;
      });
    }
  });

  // Prepare chart data
  const applicationsByJobData = Object.entries(applicantMetrics.applicationsByJob).map(([job, count]) => ({
    name: job,
    value: count
  }));

  const statusDistributionData = Object.entries(applicantMetrics.statusDistribution)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));

  const timeSeriesData = Object.entries(applicantMetrics.applicationsByDate)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, count]) => ({
      date: dayjs(date).format('MMM DD'),
      applications: count
    }));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <EmployerNavbar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}>
          <Toolbar />

          {/* Header with Welcome and Date Range Picker */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Welcome, {user ? full_name : 'Employer'}
            </Typography>
            <Box display="flex" alignItems="center">
              <CalendarTodayIcon sx={{ mr: 1 }} />
              <DateRangePicker
                startText="Start Date"
                endText="End Date"
                value={dateRange}
                onChange={handleDateChange}
                renderInput={(startProps, endProps) => (
                  <>
                    <TextField {...startProps} />
                    <Box sx={{ mx: 2 }}> to </Box>
                    <TextField {...endProps} />
                  </>
                )}
              />
            </Box>
          </Box>

          {/* Dashboard Statistics */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6">Total Jobs Posted</Typography>
                <Typography variant="h4">{totalJobsPosted}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6">Total Applications</Typography>
                <Typography variant="h4">{applicationsReceived}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6">Avg. Applications per Job</Typography>
                <Typography variant="h4">
                  {totalJobsPosted ? (applicationsReceived / totalJobsPosted).toFixed(1) : 0}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Applications Over Time Chart */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Applications Over Time
            </Typography>
            <Box display="flex" justifyContent="center">
              <LineChart width={800} height={300} data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="applications" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </Box>
          </Paper>

          {/* Applications by Job and Status Distribution */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Applications by Job
                </Typography>
                <Box display="flex" justifyContent="center">
                  <PieChart width={400} height={300}>
                    <Pie
                      data={applicationsByJobData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {applicationsByJobData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" align="center" />
                  </PieChart>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Application Status Distribution
                </Typography>
                <Box display="flex" justifyContent="center">
                  <PieChart width={400} height={300}>
                    <Pie
                      data={statusDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistributionData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" align="center" />
                  </PieChart>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Detailed Applications List */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Applications by Job
            </Typography>
            <List>
              {filteredJobs.map((job) => {
                const jobApplicants = aggregatedApplicants[job.id] || [];
                return (
                  <React.Fragment key={job.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {job.title} ({jobApplicants.length} applicants)
                          </Typography>
                        }
                      />
                    </ListItem>
                    {jobApplicants.map((applicant) => (
                      <ListItem key={applicant.id} divider sx={{ pl: 4 }}>
                        <Avatar
                          alt={applicant.job_seeker?.user?.full_name || "Unknown"}
                          src={applicant.job_seeker?.profile_photo ? `http://localhost:8000${applicant.job_seeker.profile_photo}` : undefined}
                        />
                        <ListItemText
                          primary={applicant.job_seeker?.user?.full_name || "Unknown"}
                          secondary={
                            <React.Fragment>
                              <Typography component="span" variant="body2" display="block">
                                Applied: {new Date(applicant.applied_at).toLocaleDateString()}
                              </Typography>
                              <Typography component="span" variant="body2" display="block">
                                Status: {applicant.status}
                              </Typography>
                              <Typography component="span" variant="body2" display="block">
                                Experience: {applicant.job_seeker?.experience || "Not specified"}
                              </Typography>
                              {applicant.job_seeker?.skills && (
                                <Typography component="span" variant="body2" display="block">
                                  Skills: {applicant.job_seeker.skills.join(', ')}
                                </Typography>
                              )}
                            </React.Fragment>
                          }
                          sx={{ ml: 2 }}
                        />
                        <IconButton component={Link} to={`/applicant/${applicant.id}`} edge="end">
                          <ArrowForwardIosIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                    {jobApplicants.length === 0 && (
                      <ListItem sx={{ pl: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No applications yet
                        </Typography>
                      </ListItem>
                    )}
                  </React.Fragment>
                );
              })}{filteredJobs.length === 0 && (
                <ListItem>
                  <Typography>No jobs found within the selected date range.</Typography>
                </ListItem>
              )}
            </List>
          </Paper>

          {/* Upcoming Interviews */}
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Interviews
            </Typography>
            <List>
              {Object.values(aggregatedApplicants).flat().flatMap(applicant =>
                applicant.job_seeker.interview_schedule
                  .filter(interview => 
                    dayjs(interview.scheduled_time).isAfter(dayjs()) || 
                    dayjs(interview.scheduled_time).isSame(dayjs(), 'day')
                  )
                  .map(interview => {
                    const jobDetails = filteredJobs.find(job => 
                      applicant.job_seeker.myapplications?.some(app => 
                        app.job === job.id && app.id === interview.job_application
                      )
                    );

                    return (
                      <ListItem key={interview.id} divider>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={8}>
                            <ListItemText
                              primary={
                                <Typography variant="subtitle1">
                                  Interview with {applicant.job_seeker.user.full_name}
                                </Typography>
                              }
                              secondary={
                                <React.Fragment>
                                  <Typography component="span" variant="body2" display="block">
                                    Job: {jobDetails ? jobDetails.title : 'Unknown Job'}
                                  </Typography>
                                  <Typography component="span" variant="body2" display="block">
                                    Date: {new Date(interview.scheduled_time).toLocaleString()}
                                  </Typography>
                                  <Typography component="span" variant="body2" display="block">
                                    Location: {interview.location || 'TBD'}
                                  </Typography>
                                </React.Fragment>
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Typography variant="body2" color="text.secondary">
                              Duration: {interview.duration ? `${interview.duration} minutes` : 'Not Specified'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                    );
                  })
              )}
              {Object.values(aggregatedApplicants).flat().every(applicant => 
                applicant.job_seeker.interview_schedule.length === 0
              ) && (
                <ListItem>
                  <Typography variant="body2" color="text.secondary">
                    No upcoming interviews scheduled
                  </Typography>
                </ListItem>
              )}
            </List>
          </Paper>

          {/* Job Performance Metrics */}
          <Paper sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Job Performance
            </Typography>
            <List>
              {filteredJobs.map(job => {
                const jobApplicants = aggregatedApplicants[job.id] || [];
                const activeApplicants = jobApplicants.filter(app => 
                  app.status.toLowerCase() !== 'rejected' && 
                  app.status.toLowerCase() !== 'withdrawn'
                );

                return (
                  <ListItem key={job.id} divider>
                    <ListItemText
                      primary={job.title}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" display="block">
                            Total Applications: {jobApplicants.length}
                          </Typography>
                          <Typography component="span" variant="body2" display="block">
                            Active Applications: {activeApplicants.length}
                          </Typography>
                          <Typography component="span" variant="body2" display="block">
                            Posted: {new Date(job.posted_at).toLocaleDateString()}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    <IconButton component={Link} to={`/job/${job.id}`} edge="end">
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </ListItem>
                );
              })}
              {filteredJobs.length === 0 && (
                <ListItem>
                  <Typography variant="body2" color="text.secondary">
                    No jobs found within the selected date range
                  </Typography>
                </ListItem>
              )}
            </List>
          </Paper>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default EmployerDashboard;