import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { 
  fetchJobById, 
  selectJobById,
  saveJob, 
  unsaveJob, 
  fetchSavedJobs, 
  selectSavedJobs  
} from '../features/jobs/jobsSlice';
import { fetchProfile } from '../features/jobseeker/jobseekerSlice2';
import {
  applyForJob,
  checkApplicationStatus,
  selectUserApplicationStatus,
  clearApplicationError,
  clearUserApplicationStatus,
} from '../features/jobapplication/jobApplicationSlice';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Chip,
  Grid,
  IconButton,
  Button,
  TextField,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Business,
  LocationOn,
  CalendarToday,
  AttachMoney,
  DateRange,
  Work,
  Assignment,
  AssignmentInd,
  VerifiedUser,
  Home,
  Layers,
} from '@mui/icons-material';
import Navbar from './Navbar';
import { createChatRoom } from '../features/chat/chatSlice';
import theme from '../theme/theme';

const JobDetails = () => {
  const role = useSelector((state) => state.auth.role); 
  const isLoggedIn = useSelector((state) => !!state.auth.user); // Check if user is logged in
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const savedJobs = useSelector(selectSavedJobs);
  const job = useSelector((state) => selectJobById(state, jobId));
  const jobStatus = useSelector((state) => state.jobs.status);
  const jobError = useSelector((state) => state.jobs.error);
  const applicationStatus = useSelector((state) => state.applications.status);
  const applicationError = useSelector((state) => state.applications.error);
  const userApplicationStatus = useSelector(selectUserApplicationStatus);
  const userProfile = useSelector((state) => state.profile.data);
  const userid = useSelector(state => state.auth.userid);

  // Add this state to track if a valid file is uploaded
  const [isValidFileUploaded, setIsValidFileUploaded] = useState(false);

  // Modify the file upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomResume(file);
      setIsValidFileUploaded(true);
    } else {
      setCustomResume(null);
      setIsValidFileUploaded(false);
    }
  };

  console.log("hi", userProfile)
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [useProfileResume, setUseProfileResume] = useState(false);
  const [customResume, setCustomResume] = useState(null);
  const [savingStatus, setSavingStatus] = useState({});

  useEffect(() => {
    // Reset success message on component mount and when the job or application status changes
    setShowSuccess(false);
    
    if (!job && jobStatus === 'idle') {
      dispatch(fetchJobById(jobId));
    }
    dispatch(fetchProfile());
  }, [job, jobId, dispatch, jobStatus]);

  useEffect(() => {
    if (userProfile && userProfile.resume != null) {
      setUseProfileResume(true);
    }else {
      setUseProfileResume(false);  // Reset to false if there's no valid resume
    }
  }, [userProfile]);

  useEffect(() => {
    if (job) {
      dispatch(checkApplicationStatus(jobId));
    }
  }, [job, dispatch, jobId, isApplying]);

  useEffect(() => {
    if (applicationStatus === 'failed' || userApplicationStatus.status === 'failed') {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        dispatch(clearApplicationError());
        dispatch(clearUserApplicationStatus());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [applicationStatus, userApplicationStatus.status, dispatch]);

  useEffect(() => {
    if (applicationStatus === 'succeeded') {
      setIsApplying(false);
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowSuccess(false); // Reset on failure or other status
    }
  }, [applicationStatus]);

  const handleApply = () => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if user is not logged in
      return;
    }

    setIsApplying(true);
    const resume = useProfileResume ? userProfile.resume : customResume;
    dispatch(applyForJob({ jobId, resume, cover_letter: coverLetter, use_profile_resume: useProfileResume }));
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some(savedJob => savedJob.job === jobId);
  };

  const handleChat = () => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if user is not logged in
      return;
    }

    if (userid && job.employer) {
      dispatch(createChatRoom({ jobseekerId: userid, employerId: job.employer }))
        .unwrap()
        .then(() => {
          navigate('/chat');
        })
        .catch((error) => {
          console.error('Failed to create chat room:', error);
        });
    }
  };

  const handleSaveJob = async (job) => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if user is not logged in
      return;
    }

    setSavingStatus((prevStatus) => ({ ...prevStatus, [job.id]: 'loading' }));
    if (isJobSaved(job.id)) {
      await dispatch(unsaveJob(job.id));
    } else {
      await dispatch(saveJob(job.id));
    }
    await dispatch(fetchSavedJobs());
    setSavingStatus((prevStatus) => ({ ...prevStatus, [job.id]: 'idle' }));
  };

  if (jobStatus === 'loading' || userApplicationStatus.status === 'loading') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (jobStatus === 'failed') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Error: {jobError}</Typography>
      </Box>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h6" color="textSecondary" align="center">
          Job not found.
        </Typography>
      </Container>
    );
  }

  const postedDate = new Date(job.posted_at);
  const deadlineDate = new Date(job.application_deadline);
  const isPostedDateValid = !isNaN(postedDate.getTime());
  const isDeadlineDateValid = !isNaN(deadlineDate.getTime());

  const iconSize = 20; // Set a consistent icon size

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Navbar />
        <Card
          elevation={4}
          sx={{
            borderRadius: 3,
            backgroundColor: isJobSaved(job.id) ? theme.palette.background.light : theme.palette.background.default,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: theme.palette.common.purple.shadow,
              transform: 'translateY(-2px)',
            },
            position: 'relative',
            overflow: 'visible',
          }}
        >
          {/* Job Status Badge */}
          {userApplicationStatus.hasApplied && (
            <Box
              sx={{
                position: 'absolute',
                top: -12,
                right: 24,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                zIndex: 1,
              }}
            >
              Applied
            </Box>
          )}
          
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Business fontSize="large" sx={{ color: theme.palette.primary.main }} />
                <Box>
                  <Typography variant="h4" component="h1" sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    mb: 0.5,
                  }}>
                    {job.title}
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: theme.palette.secondary.main,
                    fontWeight: 600,
                  }}>
                    {job.company.name}
                  </Typography>
                </Box>
              </Box>
            }
            action={
              role !== 'employer' && (
                <IconButton 
                  onClick={() => handleSaveJob(job)} 
                  sx={{ 
                    ml: 'auto',
                    '&:hover': {
                      backgroundColor: theme.palette.common.purple.hover,
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                  }} 
                  disabled={savingStatus[job.id] === 'loading'}
                >
                  {isJobSaved(job.id) ? 
                    <BookmarkIcon sx={{ color: theme.palette.primary.main, fontSize: '28px' }} /> : 
                    <BookmarkBorderIcon sx={{ color: theme.palette.primary.main, fontSize: '28px' }} />
                  }
                </IconButton>
              )
            }
          />
          <Divider sx={{ mx: 2 }} />
          <CardContent sx={{ pt: 3 }}>
            {/* Quick Info Section */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3, 
              mb: 4,
              p: 3,
              backgroundColor: theme.palette.background.light,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}>
                <LocationOn sx={{ color: theme.palette.primary.main }} />
                <Typography sx={{ fontWeight: 500 }}>{job.location}</Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}>
                <Work sx={{ color: theme.palette.primary.main }} />
                <Typography sx={{ fontWeight: 500 }}>{job.employment_type}</Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}>
                <AttachMoney sx={{ color: theme.palette.primary.main }} />
                <Typography sx={{ fontWeight: 500 }}>{job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                }
              }}>
                <DateRange sx={{ color: theme.palette.primary.main }} />
                <Typography sx={{ fontWeight: 500 }}>Deadline: {isDeadlineDateValid ? deadlineDate.toLocaleDateString() : 'Invalid date'}</Typography>
              </Box>
            </Box>

            {/* Additional Info Pills */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 2, 
              mb: 4 
            }}>
              <Chip 
                icon={<Layers sx={{ color: theme.palette.primary.main }} />}
                label={`Experience: ${job.experience_level}`}
                sx={{ 
                  backgroundColor: 'white',
                  fontWeight: 500,
                  '&:hover': { transform: 'translateY(-2px)' },
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              />
              <Chip 
                icon={<Work sx={{ color: theme.palette.primary.main }} />}
                label={`Function: ${job.job_function}`}
                sx={{ 
                  backgroundColor: 'white',
                  fontWeight: 500,
                  '&:hover': { transform: 'translateY(-2px)' },
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              />
              <Chip 
                icon={<Home sx={{ color: theme.palette.primary.main }} />}
                label={`Remote: ${job.is_remote ? 'Yes' : 'No'}`}
                sx={{ 
                  backgroundColor: 'white',
                  fontWeight: 500,
                  '&:hover': { transform: 'translateY(-2px)' },
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ 
                  backgroundColor: theme.palette.background.paper,
                  p: 2.5,
                  borderRadius: 2,
                  mb: 3,
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <Assignment /> Job Description
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7 }}>{job.description}</Typography>
                </Box>
              </Grid>

              {/* Skills Section */}
              {job.skills && job.skills.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ 
                    backgroundColor: theme.palette.background.paper,
                    p: 2.5,
                    borderRadius: 2,
                    mb: 3,
                  }}>
                    <Typography variant="h6" gutterBottom sx={{ 
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      mb: 2,
                    }}>
                      Required Skills
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {job.skills.map((skill, index) => (
                        <Chip 
                          key={index} 
                          label={skill} 
                          sx={{ 
                            backgroundColor: theme.palette.background.light,
                            color: theme.palette.primary.main,
                            fontWeight: 500,
                            '&:hover': {
                              backgroundColor: theme.palette.background.medium,
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.2s ease',
                            px: 1,
                          }} 
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              )}

              {/* Details Sections */}
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  backgroundColor: theme.palette.background.paper,
                  p: 2.5,
                  borderRadius: 2,
                  height: '100%',
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <VerifiedUser /> Qualifications
                  </Typography>
                  <Typography sx={{ lineHeight: 1.7 }}>{job.qualifications}</Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  backgroundColor: theme.palette.background.paper,
                  p: 2.5,
                  borderRadius: 2,
                  height: '100%',
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <Assignment /> Responsibilities
                  </Typography>
                  <Typography sx={{ lineHeight: 1.7 }}>{job.responsibilities}</Typography>
                </Box>
              </Grid>

              {/* Application Section */}
              <Grid item xs={12}>
                <Box sx={{ 
                  backgroundColor: theme.palette.background.paper,
                  p: 4,
                  borderRadius: 2,
                  mt: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}>
                  <Typography variant="h6" gutterBottom sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}>
                    <AssignmentInd /> Apply for this position
                  </Typography>

                  {showSuccess && (
                    <Alert 
                      severity="success" 
                      onClose={() => setShowSuccess(false)}
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        '& .MuiAlert-icon': {
                          color: theme.palette.primary.main,
                        }
                      }}
                    >
                      Application submitted successfully!
                    </Alert>
                  )}
                  
                  <Box sx={{ 
                    mb: 4,
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.light,
                  }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={useProfileResume}
                          onChange={(e) => setUseProfileResume(e.target.checked)}
                          disabled={isApplying || userApplicationStatus.hasApplied || !userProfile?.resume}
                          sx={{ 
                            color: theme.palette.primary.main,
                            '&.Mui-checked': {
                              color: theme.palette.primary.main,
                            }
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontWeight: 500 }}>
                          Use profile resume
                        </Typography>
                      }
                    />
                    
                    {!useProfileResume && (
                      <TextField
                        type="file"
                        onChange={handleFileUpload}
                        disabled={isApplying || userApplicationStatus.hasApplied}
                        sx={{ 
                          mt: 2,
                          width: '100%',
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                            '&:hover fieldset': {
                              borderColor: theme.palette.primary.main,
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: theme.palette.primary.main,
                            }
                          },
                        }}
                      />
                    )}
                  </Box>

                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                  }}>
                    <Button
                      variant="contained"
                      onClick={handleApply}
                      disabled={
                        isApplying || 
                        userApplicationStatus.hasApplied || 
                        (useProfileResume && !userProfile?.resume) ||
                        (!useProfileResume && !isValidFileUploaded)
                      }
                      sx={{ 
                        background: theme.palette.common.purple.gradient,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: '25px',
                        '&:hover': {
                          background: theme.palette.common.purple.gradient,
                          opacity: 0.9,
                          transform: 'translateY(-2px)',
                        },
                        '&:disabled': {
                          background: '#e0e0e0',
                          color: '#9e9e9e',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {userApplicationStatus.hasApplied ? 'Already Applied' : 'Apply Now'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={handleChat}
                      sx={{ 
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        borderRadius: '25px',
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: theme.palette.background.light,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Chat with Employer
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default JobDetails;