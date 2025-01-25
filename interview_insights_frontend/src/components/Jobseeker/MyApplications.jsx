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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ 
        background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
        borderRadius: '15px',
        p: 3,
        mb: 4,
        boxShadow: '0 3px 5px 2px rgba(74, 20, 140, 0.3)'
      }}>
        <Typography variant="h4" align="center" sx={{ mb: 1, color: '#fff', fontWeight: 700 }}>
          My Applications
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          Track your job applications and interview progress
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mb: 4,
        gap: 2,
        flexWrap: 'wrap'
      }}>
        <TextField
          placeholder="Search by company or job title..."
          variant="outlined"
          size="small"
          fullWidth
          sx={{ 
            flexGrow: 1,
            maxWidth: { xs: '100%', sm: '60%' },
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              '&:hover': {
                backgroundColor: theme.palette.background.light,
              }
            }
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: theme.palette.primary.main }} />,
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          displayEmpty
          variant="outlined"
          size="small"
          sx={{ 
            minWidth: { xs: '100%', sm: 200 },
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            '&:hover': {
              backgroundColor: theme.palette.background.light,
            }
          }}
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
      </Box>

      <Grid container spacing={3}>
        {filteredApplications.map((application) => {
          const interview = getInterviewForApplication(application.id);
          const interviewFeedback = interview ? getFeedbackForInterview(interview.id) : null;

          return (
            <Grid item xs={12} sm={6} lg={4} key={application.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(74, 20, 140, 0.2)'
                  },
                  bgcolor: theme.palette.background.paper,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={application.job_details.company.logoUrl}
                      alt={application.job_details.company.name}
                      sx={{ 
                        mr: 2, 
                        width: 60, 
                        height: 60,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 'bold',
                        color: theme.palette.primary.main,
                        lineHeight: 1.2
                      }}>
                        {application.job_details.company.name}
                      </Typography>
                      <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary }}>
                        {application.job_details.title}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ 
                      color: theme.palette.text.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1
                    }}>
                      Applied on: {new Date(application.applied_at).toLocaleDateString()}
                    </Typography>
                    <Chip 
                      label={application.status.replace('_', ' ').toUpperCase()} 
                      sx={{ 
                        bgcolor: theme.palette.secondary.main,
                        color: theme.palette.text.white,
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }} 
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {interview ? (
                        <Box sx={{ 
                          p: 1.5,
                          bgcolor: theme.palette.background.light,
                          borderRadius: 2
                        }}>
                          <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, mb: 1 }}>
                            Interview Details
                          </Typography>
                          Scheduled: {new Date(interview.scheduled_time).toLocaleString()}
                          <br />
                          Location: {interview.location}
                        </Box>
                      ) : (
                        <Box sx={{ 
                          color: theme.palette.text.secondary,
                          fontStyle: 'italic',
                          textAlign: 'center',
                          py: 1
                        }}>
                          No Interview Scheduled
                        </Box>
                      )}
                    </Typography>

                    <Typography variant="body2">
                      {interviewFeedback ? (
                        <Box sx={{ 
                          p: 1.5,
                          bgcolor: theme.palette.background.light,
                          borderRadius: 2
                        }}>
                          <Typography variant="subtitle2" sx={{ color: theme.palette.primary.main, mb: 1 }}>
                            Feedback
                          </Typography>
                          Score: {interviewFeedback.score}
                          <br />
                          {interviewFeedback.feedback}
                        </Box>
                      ) : (
                        <Box sx={{ 
                          color: theme.palette.text.secondary,
                          fontStyle: 'italic',
                          textAlign: 'center',
                          py: 1
                        }}>
                          No Feedback Available
                        </Box>
                      )}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    mt: 3,
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 2
                  }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleDownloadResume(application.resume)}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        flex: 1,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': { 
                          backgroundColor: theme.palette.background.light,
                          borderColor: theme.palette.primary.dark,
                          color: theme.palette.primary.dark 
                        }
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
                        flex: 1,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.text.white,
                        '&:hover': { 
                          backgroundColor: theme.palette.primary.dark
                        }
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