import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicants, updateApplicantStatus } from '../../features/applicants/applicantsSlice';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Avatar,
  CssBaseline,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate, useParams } from 'react-router-dom';
import EmployerNavbar from '../EmployerNavbar';
import { createChatRoom } from '../../features/chat/chatSlice';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b',
    },
    secondary: {
      main: '#b2dfdb',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 'bold',
    },
  },
});

const ApplicantsList = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const applicants = useSelector((state) => state.applicants.applicants);
  const status = useSelector((state) => state.applicants.status);
  const error = useSelector((state) => state.applicants.error);
  const navigate = useNavigate();
  const userid = useSelector((state) => state.auth.userid);

  // State for modal
  const [open, setOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  useEffect(() => {
    dispatch(fetchApplicants(jobId));
  }, [dispatch, jobId]);

  const handleStatusChange = (applicantId, newStatus) => {
    dispatch(updateApplicantStatus({ applicantId, status: newStatus })).then(() => {
      dispatch(fetchApplicants(jobId)); // Re-fetch applicants to get the updated status
    });
  };

  const handleChat = (jobseekerId) => {
    if (jobseekerId && userid) {
      dispatch(createChatRoom({ jobseekerId, employerId: userid }))
        .unwrap()
        .then(() => {
          navigate('/Employer/chat');
        })
        .catch((error) => {
          console.error('Failed to create chat room:', error);
        });
    }
  };

  const handleDownloadResume = (resumeUrl) => {
    window.open(`http://localhost:8000${resumeUrl}`, '_blank');
  };

  // Open the modal
  const handleClickOpen = (applicant) => {
    setSelectedApplicant(applicant);
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedApplicant(null);
  };

  if (status === 'loading') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <EmployerNavbar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total Applicants: {applicants.length}</Typography>
                <Box>
                  <TextField
                    placeholder="Search Applicants"
                    variant="outlined"
                    size="small"
                    sx={{ mr: 2 }}
                    InputProps={{
                      startAdornment: (
                        <SearchIcon />
                      ),
                    }}
                  />
                  <IconButton>
                    <FilterListIcon />
                  </IconButton>
                </Box>
              </Box>
              <Divider />
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Full Name</TableCell>
                      <TableCell>Hiring Stage</TableCell>
                      <TableCell>Applied Date</TableCell>
                      <TableCell>Schedule</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Chat</TableCell>
                      <TableCell>Profile</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {applicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={`http://localhost:8000${applicant.job_seeker.profile_photo}`}
                              alt={applicant.job_seeker.user.full_name}
                              sx={{ mr: 2, width: 40, height: 40 }}
                            />
                            {applicant.job_seeker.user.full_name}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={applicant.status || 'N/A'}
                            onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                            variant="outlined"
                          >
                            <MenuItem value="applied">Applied</MenuItem>
                            <MenuItem value="reviewed">Reviewed</MenuItem>
                            <MenuItem value="interview_scheduled">Interview Scheduled</MenuItem>
                            <MenuItem value="interviewed">Interviewed</MenuItem>
                            <MenuItem value="hired">Hired</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                          </Select>
                        </TableCell>
                        <TableCell>{new Date(applicant.applied_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => handleDownloadResume(applicant.resume)}
                          >
                            See Application
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/schedule-interview/${applicant.id}`)}
                          >
                            Schedule Interview
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleChat(applicant.job_seeker.user.id)}> Chat</Button>
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleClickOpen(applicant)}>Profile</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Profile Dialog */}
          <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Applicant Profile</DialogTitle>
            <DialogContent>
              {selectedApplicant && (
                <div>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={`http://localhost:8000${selectedApplicant.job_seeker.profile_photo}`}
                      alt={selectedApplicant.job_seeker.user.full_name}
                      sx={{ mr: 2, width: 80, height: 80 }}
                    />
                    <Typography variant="h6">{selectedApplicant.job_seeker.user.full_name}</Typography>
                  </Box>
                  <Typography variant="body1"><strong>Email:</strong> {selectedApplicant.job_seeker.user.email}</Typography>
                  <Typography variant="body1"><strong>Phone Number:</strong> {selectedApplicant.job_seeker.phone_number}</Typography>
                  <Typography variant="body1"><strong>Date of Birth:</strong> {new Date(selectedApplicant.job_seeker.date_of_birth).toLocaleDateString()}</Typography>
                  <Typography variant="body1"><strong>Bio:</strong> {selectedApplicant.job_seeker.bio}</Typography>
                  <Typography variant="body1"><strong>LinkedIn:</strong> {selectedApplicant.job_seeker.linkedin_url || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Portfolio:</strong> {selectedApplicant.job_seeker.portfolio_url || 'N/A'}</Typography>
                  <Typography variant="body1"><strong>Current Job Title:</strong> {selectedApplicant.job_seeker.current_job_title}</Typography>
                  <Typography variant="body1"><strong>Job Preferences:</strong> {selectedApplicant.job_seeker.job_preferences}</Typography>
                 
                  {/* Work Experience */}
                  <Typography variant="h6" style={{ marginTop: '16px' }}>Work Experience</Typography>
                  {selectedApplicant.job_seeker.work_experience && selectedApplicant.job_seeker.work_experience.length > 0 ? (
                    selectedApplicant.job_seeker.work_experience.map((experience) => (
                      <div key={experience.id}>
                        <Typography variant="body1"><strong>Job Title:</strong> {experience.job_title}</Typography>
                        <Typography variant="body1"><strong>Company:</strong> {experience.company_name}</Typography>
                        <Typography variant="body1"><strong>Location:</strong> {experience.company_location}</Typography>
                        <Typography variant="body1"><strong>Start Date:</strong> {new Date(experience.start_date).toLocaleDateString()}</Typography>
                        <Typography variant="body1"><strong>End Date:</strong> {new Date(experience.end_date).toLocaleDateString() || 'Present'}</Typography>
                        <Divider style={{ margin: '10px 0' }} />
                      </div>
                    ))
                  ) : (
                    <Typography variant="body1">No work experience available.</Typography>
                  )}

                  {/* Skills */}
                  <Typography variant="h6" style={{ marginTop: '16px' }}>Skills</Typography>
                  {selectedApplicant.job_seeker.skills && selectedApplicant.job_seeker.skills.length > 0 ? (
                    selectedApplicant.job_seeker.skills.map((skill) => (
                      <Typography key={skill.id} variant="body1">
                        <strong>{skill.skill_name}</strong> - {skill.proficiency_level}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="body1">No skills available.</Typography>
                  )}

                  {/* Display interview feedback along with job and company details */}
                  <Typography variant="h6" style={{ marginTop: '16px' }}>Interview Feedback</Typography>
                  {selectedApplicant.job_seeker.interview_feedback && selectedApplicant.job_seeker.interview_feedback.length > 0 ? (
                    selectedApplicant.job_seeker.interview_feedback
                      .filter(feedback => feedback.is_approved) // Filter for approved feedback
                      .map((feedback) => {
                        const interviewSchedule = selectedApplicant.job_seeker.interview_schedule?.find(schedule => schedule.id === feedback.interview_schedule);
                        const jobApplication = selectedApplicant.job_seeker.myapplications?.find(application => application.id === selectedApplicant.id);
                        const jobDetails = jobApplication ? jobApplication.job_details : null;
                        const companyDetails = jobDetails ? jobDetails.company : null;

                        return (
                          <div key={feedback.id}>
                            <Typography variant="body1"><strong>Stage:</strong> {feedback.stage}</Typography>
                          
                            <Typography variant="body1"><strong>Feedback:</strong> {feedback.feedback}</Typography>
                            <Typography variant="body1"><strong>Provided At:</strong> {new Date(feedback.provided_at).toLocaleDateString()}</Typography>
                          
                            {jobDetails && companyDetails && (
                              <div>
                                <Typography variant="body1"><strong>Job Title:</strong> {jobDetails.title}</Typography>
                                <Typography variant="body1"><strong>Company:</strong> {companyDetails.name}</Typography>
                              </div>
                            )}
                            <Divider style={{ margin: '10px 0' }} />
                          </div>
                        );
                      })
                  ) : (
                    <Typography variant="body1">No feedback available.</Typography>
                  )}
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ApplicantsList;