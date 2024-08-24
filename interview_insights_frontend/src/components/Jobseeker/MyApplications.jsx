import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications } from '../../features/applications/applicationsSlice';
import { fetchInterviews, fetchFeedback } from '../../features/interview/interviewSlice';
import { createChatRoom } from '../../features/chat/chatSlice';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Button,
  TextField,
  IconButton,
  Grid,
  Chip,
  Avatar,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTheme } from '@mui/material/styles';

const MyApplications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const applications = useSelector((state) => state.myapplications.applications);
  const applicationsStatus = useSelector((state) => state.myapplications.status);
  const applicationsError = useSelector((state) => state.myapplications.error);

  const interviews = useSelector((state) => state.interviews.interviews);
  const interviewsStatus = useSelector((state) => state.interviews.status);
  const interviewsError = useSelector((state) => state.interviews.error);

  const currentFeedback = useSelector((state) => state.interviews.currentFeedback);
  const userid = useSelector((state) => state.auth.userid);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredApplications, setFilteredApplications] = useState(applications);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    dispatch(fetchApplications());
    dispatch(fetchInterviews());
    if (interviews.length > 0) {
      interviews.forEach(interview => {
        dispatch(fetchFeedback(interview.id));
      });
    }
  }, [dispatch, interviews.length]);

  useEffect(() => {
    let applicationsToFilter = applications;

    // Filter by status
    if (selectedStatus) {
      applicationsToFilter = applicationsToFilter.filter(app => app.status === selectedStatus);
    }

    // Search filtering
    applicationsToFilter = applicationsToFilter.filter(app =>
      app.job_details.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job_details.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredApplications(applicationsToFilter);
  }, [searchTerm, applications, selectedStatus]);

  const handleChat = (userid, employer) => {
    if (userid && employer) {
      dispatch(createChatRoom({ jobseekerId: userid, employerId: employer }))
        .unwrap()
        .then(() => {
          navigate('/chat');
        })
        .catch((error) => {
          console.error('Failed to create chat room:', error);
        });
    }
  };

  const handleDownloadResume = (resumeUrl) => {
    window.open(`${resumeUrl}`, '_blank');
  };

  const getInterviewForApplication = (applicationId) => {
    return interviews.find(interview => interview.job_application === applicationId);
  };

  const getFeedbackForInterview = (interviewId) => {
    return currentFeedback && currentFeedback.interview_schedule === interviewId
      ? currentFeedback
      : null;
  };

  if (applicationsStatus === 'loading' || interviewsStatus === 'loading') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (applicationsStatus === 'failed' || interviewsStatus === 'failed') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Error: {applicationsError || interviewsError}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" sx={{ mb: 2, color: '#004d40' }}>My Applications</Typography>
      <Divider sx={{ mb: 2, backgroundColor: '#004d40' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          placeholder="Search Jobs"
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1, mr: 1, borderRadius: 2 }}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          displayEmpty
          variant="outlined"
          size="small"
          sx={{ mr: 1, minWidth: 120, borderRadius: 2 }}
        >
          <MenuItem value="">
            <em>All Status</em>
          </MenuItem>
          <MenuItem value="applied">Applied</MenuItem>
          <MenuItem value="reviewed">Reviewed</MenuItem>
          <MenuItem value="interview_scheduled">Interview Scheduled</MenuItem>
          <MenuItem value="interviewed">Interviewed</MenuItem>
          <MenuItem value="offered">Offered</MenuItem>
          <MenuItem value="hired">Hired</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </Select>

        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        {filteredApplications.map((application) => {
          const interview = getInterviewForApplication(application.id);
          const interviewFeedback = interview ? getFeedbackForInterview(interview.id) : null;

          return (
            <Grid item xs={12} sm={6} md={4} key={application.id}>
              <Card sx={{ mb: 2, p: 2, borderRadius: 7, transition: '.1s', '&:hover': { boxShadow: 20 }, height: 360 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        src={application.job_details.company.logoUrl}
                        alt={application.job_details.company.name}
                        sx={{ mr: 2, width: 56, height: 56 }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#004d40' }}>{application.job_details.company.name}</Typography>
                    </Box>
                    <Typography variant="subtitle1">{application.job_details.title}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Applied on: {new Date(application.applied_at).toLocaleDateString()}
                    </Typography>
                    <Chip label={application.status} sx={{ mt: 1, bgcolor: '#00796b', color: 'white' }} />
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      {interview ? (
                        <Box>
                          Scheduled: {new Date(interview.scheduled_time).toLocaleString()}
                          <br />
                          Location: {interview.location}
                        </Box>
                      ) : (
                        <Box sx={{ color: 'text.secondary', fontStyle: 'italic' }}>No Interview Scheduled</Box>
                      )}
                    </Typography>
                    <Typography variant="body2">
                      {interviewFeedback ? (
                        <Box>
                          Score: {interviewFeedback.score}
                          <br />
                          Feedback: {interviewFeedback.feedback}
                        </Box>
                      ) : (
                        <Box sx={{ color: 'text.secondary', fontStyle: 'italic' }}>No Feedback Available</Box>
                      )}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleDownloadResume(application.resume)}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#b2dfdb', color: '#004d40' }
                      }}
                    >
                      See Application
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleChat(userid, application.job_details.employer)}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        backgroundColor: '#00796b',
                        color: 'white',
                        '&:hover': { backgroundColor: '#004d40', color: '#fff' }
                      }}
                    >
                      Chat
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default MyApplications;