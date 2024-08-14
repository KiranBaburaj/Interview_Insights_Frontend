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
} from '@mui/material';
import { PieChart, Pie, Cell } from 'recharts';
import { fetchProfile } from '../../features/jobseeker/jobseekerSlice2';
import JobseekerNavbar from '../../components/JobseekerNavbar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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

  // Get interviews with their corresponding job details
  const interviewsWithJobDetails = filteredInterviews.map(interview => {
    const application = filteredApplications.find(app => app.id === interview.job_application);
    return {
      ...interview,
      job_details: application ? application.job_details : null,
    };
  });

  // Function to get feedback for a specific interview
  const getFeedbackForInterview = (interviewId) => {
    const feedback = profile.interview_feedback.find(feedback => feedback.interview_schedule === interviewId);
    return feedback ? feedback : null;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <JobseekerNavbar />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
        >
          <Toolbar />

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Good morning, {profile ? profile.user.full_name : 'Jobseeker'}
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

          {status === 'loading' && <Typography>Loading...</Typography>}
          {status === 'failed' && <Typography>Error loading profile.</Typography>}

          {status === 'succeeded' && profile && (
            <>
              <Box display="flex" justifyContent="space-between" mb={3}>
                <Paper sx={{ p: 2, textAlign: 'center', flex: 1, mr: 2 }}>
                  <Typography variant="h6">Total Jobs Applied</Typography>
                  <Typography variant="h4">{filteredApplications.length}</Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center', flex: 1, mr: 2 }}>
                  <Typography variant="h6">Interviewed</Typography>
                  <Typography variant="h4">{filteredInterviews.length}</Typography>
                </Paper>
                <Paper sx={{ p: 2, textAlign: 'center', flex: 2 }}>
                  <Typography variant="h6">Jobs Applied Status</Typography>
                  <PieChart width={120} height={120}>
                    <Pie
                      data={Object.entries(applicationStatusCounts).map(([status, count]) => ({
                        name: status,
                        value: count,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={50}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.keys(applicationStatusCounts).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </Paper>
              </Box>

              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
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

              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Past Interviews
                </Typography>
                {pastInterviews.length > 0 ? (
                  pastInterviews.map((interview) => {
                    const jobDetails = interviewsWithJobDetails.find(i => i.id === interview.id).job_details;
                    const feedback = getFeedbackForInterview(interview.id); // Get feedback for the interview
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
                                Stage: {feedback.stage} {/* Display the feedback stage */}
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

              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Applications History
                </Typography>
                <List>
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((application) => {
                      const jobDetails = application.job_details; // Access the job details for the application
                      return (
                        <ListItem key={application.id} divider>
                          <ListItemText
                            primary={`Job Title: ${jobDetails ? jobDetails.title : 'Job details not available.'}`} // Display job title
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

              {/* Dialog for Details */}
              <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Details</DialogTitle>
                <DialogContent>
                  <Typography variant="body1">{dialogContent?.details || 'No details available.'}</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDialog}>Close</Button>
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