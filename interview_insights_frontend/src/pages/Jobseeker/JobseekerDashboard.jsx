import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, CssBaseline, Toolbar, Typography, List, ListItem, ListItemText } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { fetchProfile } from '../../features/jobseeker/jobseekerSlice2';
import JobseekerNavbar from '../../components/JobseekerNavbar';

const JobseekerDashboard = () => {
  const dispatch = useDispatch();
  const { data: profile, status } = useSelector((state) => state.profile);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProfile());
    }
  }, [dispatch, status]);

  // Aggregate data for charts
  const applicationStatusCounts = profile
    ? profile.myapplications.reduce((acc, application) => {
        acc[application.status] = (acc[application.status] || 0) + 1;
        return acc;
      }, {})
    : {};

  const interviewScores = profile
    ? profile.interview_feedback.map((feedback) => ({
        stage: feedback.stage,
        score: feedback.score,
      }))
    : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <JobseekerNavbar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
      >
        <Toolbar />
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {profile ? profile.user.full_name : 'Jobseeker'}
        </Typography>
        {status === 'loading' && <Typography>Loading...</Typography>}
        {status === 'failed' && <Typography>Error loading profile.</Typography>}

        {status === 'succeeded' && profile && (
          <>
            <Typography variant="h6" component="h2" gutterBottom>
              Upcoming Interviews
            </Typography>
            <List>
              {profile.interview_schedule.length > 0 ? (
                profile.interview_schedule.map((interview) => (
                  <ListItem key={interview.id}>
                    <ListItemText
                      primary={`Scheduled at: ${new Date(interview.scheduled_time).toLocaleString()}`}
                      secondary={`Location: ${interview.location || 'TBD'} | Notes: ${interview.notes || 'None'}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>No upcoming interviews.</Typography>
              )}
            </List>

            <Typography variant="h6" component="h2" gutterBottom>
              My Applications
            </Typography>
            <List>
              {profile.myapplications.length > 0 ? (
                profile.myapplications.map((application) => (
                  <ListItem key={application.id}>
                    <ListItemText
                      primary={`Job ID: ${application.job}`}
                      secondary={`Status: ${application.status} | Applied at: ${new Date(application.applied_at).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography>No job applications found.</Typography>
              )}
            </List>

            {/* Application Status Pie Chart */}
            <Typography variant="h6" component="h2" gutterBottom>
              Application Status Distribution
            </Typography>
            <PieChart width={400} height={300}>
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
            </PieChart>

            {/* Interview Feedback Bar Chart */}
            <Typography variant="h6" component="h2" gutterBottom>
              Interview Feedback Scores
            </Typography>
            <BarChart width={500} height={300} data={interviewScores}>
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#8884d8" />
            </BarChart>
          </>
        )}
      </Box>
    </Box>
  );
};

export default JobseekerDashboard;
