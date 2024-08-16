import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { fetchProfile } from '../../features/jobseeker/jobseekerSlice2';
import JobseekerNavbar from '../../components/JobseekerNavbar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EventNoteIcon from '@mui/icons-material/EventNote'; // Upcoming Interviews Icon
import HistoryIcon from '@mui/icons-material/History'; // Past Interviews Icon
import DescriptionIcon from '@mui/icons-material/Description'; // Applications History Icon
import { DateRangePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const JobseekerDashboard = () => {
  const dispatch = useDispatch();
  const { data: profile, status } = useSelector((state) => state.profile);

  const [dateRange, setDateRange] = useState([null, null]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProfile());
    }
  }, [dispatch, status]);

  const handleDateChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const today = dayjs();

  const filteredApplications = profile?.myapplications.filter((application) => {
    const appliedDate = dayjs(application.applied_at);
    return (
      (!dateRange[0] || appliedDate.isAfter(dayjs(dateRange[0]).subtract(1, 'day'))) &&
      (!dateRange[1] || appliedDate.isBefore(dayjs(dateRange[1]).add(1, 'day')))
    );
  }) || [];

  const filteredInterviews = profile?.interview_schedule.filter((interview) => {
    const interviewDate = dayjs(interview.scheduled_time);
    return (
      (!dateRange[0] || interviewDate.isAfter(dayjs(dateRange[0]).subtract(1, 'day'))) &&
      (!dateRange[1] || interviewDate.isBefore(dayjs(dateRange[1]).add(1, 'day')))
    );
  }) || [];

  const pastInterviews = filteredInterviews.filter((interview) => dayjs(interview.scheduled_time).isBefore(today, 'day'));
  const upcomingInterviews = filteredInterviews.filter((interview) => dayjs(interview.scheduled_time).isAfter(today, 'day'));

  const applicationStatusCounts = filteredApplications.reduce((acc, application) => {
    acc[application.status] = (acc[application.status] || 0) + 1;
    return acc;
  }, {});

  const handleOpenDialog = (content) => {
    setDialogContent(content);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogContent(null);
  };

  const interviewsWithJobDetails = filteredInterviews.map(interview => {
    const application = filteredApplications.find(app => app.id === interview.job_application);
    return {
      ...interview,
      job_details: application ? application.job_details : null,
    };
  });

  const getFeedbackForInterview = (interviewId) => {
    const feedback = profile.interview_feedback.find(feedback => feedback.interview_schedule === interviewId);
    return feedback ? feedback : null;
  };

  const getGreeting = () => {
    const hour = dayjs().hour();
    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', bgcolor: '#f5f5f5' }}>
        <CssBaseline />
        <JobseekerNavbar />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` }, bgcolor: '#fff', borderRadius: 2, boxShadow: 3 }}
        >
          <Toolbar />

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1" sx={{ color: '#3f51b5', fontWeight: 'bold' }}>
              {getGreeting()}, {profile ? profile.user.full_name : 'Jobseeker'}
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

          {status === 'loading' && <CircularProgress />}
          {status === 'failed' && <Typography color="error">Error loading profile.</Typography>}

          {status === 'succeeded' && profile && (
            <>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#3f51b5', color: 'white', borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h6">Total Jobs Applied</Typography>
                    <Typography variant="h4">{filteredApplications.length}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f50057', color: 'white', borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h6">Interviewed</Typography>
                    <Typography variant="h4">{filteredInterviews.length}</Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5', display: 'flex', alignItems: 'center' }}>
                  <EventNoteIcon sx={{ marginRight: 1 }} />
                  Jobs Applied Status
                </Typography>
                <Box display="flex" justifyContent="center">
                  <PieChart width={400} height={400}>
                    <Pie
                      data={Object.entries(applicationStatusCounts).map(([status, count]) => ({
                        name: status,
                        value: count,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.keys(applicationStatusCounts).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" align="center" />
                  </PieChart>
                </Box>
              </Paper>

              <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5', display: 'flex', alignItems: 'center' }}>
                  <EventNoteIcon sx={{ marginRight: 1 }} />
                  Upcoming Interviews
                </Typography>
                {upcomingInterviews.length > 0 ? (
                  upcomingInterviews.map((interview) => {
                    const jobDetails = interviewsWithJobDetails.find(i => i.id === interview.id).job_details;
                    return (
                      <Box display="flex" alignItems="center" mb={2} key={interview.id}>
                        <Box flex={1}>
                          <Typography variant="body1">{new Date(interview.scheduled_time).toLocaleString()}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {jobDetails ? jobDetails.title : 'Job details not available.'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {interview.location || 'Location TBD'}
                          </Typography>
                        </Box>
                        <IconButton component={Link} to={`/job/${jobDetails ? jobDetails.id : ''}`} edge="end">
                          <ArrowForwardIosIcon />
                        </IconButton>
                      </Box>
                    );
                  })
                ) : (
                  <Typography>No upcoming interviews.</Typography>
                )}
              </Paper>

              <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5', display: 'flex', alignItems: 'center' }}>
                  <HistoryIcon sx={{ marginRight: 1 }} />
                  Past Interviews
                </Typography>
                {pastInterviews.length > 0 ? (
                  pastInterviews.map((interview) => {
                    const jobDetails = interviewsWithJobDetails.find(i => i.id === interview.id).job_details;
                    const feedback = getFeedbackForInterview(interview.id);
                    return (
                      <Box display="flex" alignItems="center" mb={2} key={interview.id}>
                        <Box flex={1}>
                          <Typography variant="body1">{new Date(interview.scheduled_time).toLocaleString()}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {jobDetails ? jobDetails.title : 'Job details not available.'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {interview.location || 'Location TBD'}
                          </Typography>
                          {feedback && (
                            <>
                              <Typography variant="body2" color="text.secondary">
                                Feedback: {feedback.feedback} (Score: {feedback.score})
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Stage: {feedback.stage}
                              </Typography>
                            </>
                          )}
                        </Box>
                        <IconButton component={Link} to={`/job/${jobDetails ? jobDetails.id : ''}`} edge="end">
                          <ArrowForwardIosIcon />
                        </IconButton>
                      </Box>
                    );
                  })
                ) : (
                  <Typography>No past interviews.</Typography>
                )}
              </Paper>

              <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5', display: 'flex', alignItems: 'center' }}>
                  <DescriptionIcon sx={{ marginRight: 1 }} />
                  Recent Applications History
                </Typography>
                <List>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((application) => {
                      const jobDetails = application.job_details;
                      return (
                        <ListItem key={application.id} divider>
                          <ListItemText
                            primary={`Job Title: ${jobDetails ? jobDetails.title : 'Job details not available.'}`}
                            secondary={`Applied on: ${new Date(application.applied_at).toLocaleDateString()}`}
                          />
                          <IconButton component={Link} to={`/job/${application.job}`} edge="end">
                            <ArrowForwardIosIcon />
                          </IconButton>
                        </ListItem>
                      );
                    })
                  ) : (
                    <Typography>No recent applications.</Typography>
                  )}
                </List>
              </Paper>

              <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Details</DialogTitle>
                <DialogContent>
                  <Typography variant="body1">{dialogContent?.details || 'No details available.'}</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="primary">Close</Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default JobseekerDashboard;