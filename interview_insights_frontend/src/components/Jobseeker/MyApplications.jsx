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
  Grid,
  Button,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const MyApplications = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const applications = useSelector((state) => state.myapplications.applications);
  const applicationsStatus = useSelector((state) => state.myapplications.status);
  const applicationsError = useSelector((state) => state.myapplications.error);
  
  const interviews = useSelector((state) => state.interviews.interviews);
  const interviewsStatus = useSelector((state) => state.interviews.status);
  const interviewsError = useSelector((state) => state.interviews.error);
  
  const currentFeedback = useSelector((state) => state.interviews.currentFeedback);
  const feedbackStatus = useSelector((state) => state.interviews.status);
  const feedbackError = useSelector((state) => state.interviews.error);
  
  const [tabValue, setTabValue] = useState(0);
  
  const userid = useSelector((state) => state.auth.userid);
  
  useEffect(() => {
    dispatch(fetchApplications());
    dispatch(fetchInterviews());
    // Fetch feedbacks for all interviews
    if (interviews.length > 0) {
      interviews.forEach(interview => {
        dispatch(fetchFeedback(interview.id));
      });
    }
  }, [dispatch, interviews.length]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
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
  
  if (applicationsStatus === 'loading' || interviewsStatus === 'loading' || feedbackStatus === 'loading') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (applicationsStatus === 'failed' || interviewsStatus === 'failed' || feedbackStatus === 'failed') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Error: {applicationsError || interviewsError || feedbackError}</Typography>
      </Box>
    );
  }
  
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
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4">My Applications</Typography>
      <Card sx={{ mt: 2, mb: 2 }}>
        <CardContent>
          {/* Additional content can go here */}
        </CardContent>
      </Card>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All " />
          <Tab label="In Review " />
          <Tab label="Interviewing " />
          <Tab label="Assessment " />
          <Tab label="Offered " />
          <Tab label="Hired " />
        </Tabs>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
        <TextField
          placeholder="Search Applicants"
          variant="outlined"
          size="small"
          sx={{ mr: 2 }}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
        />
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Box>
      <Divider />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Date Applied</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Interview</TableCell>
              <TableCell>Feedback</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Chat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application, index) => {
              const interview = getInterviewForApplication(application.id);
              const interviewFeedback = interview ? getFeedbackForInterview(interview.id) : null;
              return (
                <TableRow key={application.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={application.job_details.company.logoUrl}
                        alt={application.job_details.company.name}
                        sx={{ mr: 2 }}
                      />
                      {application.job_details.company.name}
                    </Box>
                  </TableCell>
                  <TableCell>{application.job_details.title}</TableCell>
                  <TableCell>
                    {new Date(application.applied_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip label={application.status} />
                  </TableCell>
                  <TableCell>
                    {interview ? (
                      <Box>
                        <Typography variant="body2">
                          {new Date(interview.scheduled_time).toLocaleDateString()} at {new Date(interview.scheduled_time).toLocaleTimeString()}
                        </Typography>
                        <Typography variant="body2">{interview.location}</Typography>
                      </Box>
                    ) : (
                      'No Interview Scheduled'
                    )}
                  </TableCell>
                  <TableCell>
                    {interviewFeedback ? (
                      <Box>
                        <Typography variant="body2">Score: {interviewFeedback.score}</Typography>
                        <Typography variant="body2">Feedback: {interviewFeedback.feedback}</Typography>
                        <Typography variant="body2">Stage: {interviewFeedback.stage}</Typography>
                      </Box>
                    ) : (
                      'No Feedback Available'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleDownloadResume(application.resume)}
                    >
                      See Application
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleChat(userid, application.job_details.employer)}>
                      Chat
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MyApplications;
