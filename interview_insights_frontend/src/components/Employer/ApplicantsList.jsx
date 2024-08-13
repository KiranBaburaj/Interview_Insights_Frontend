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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate, useParams } from 'react-router-dom';
import EmployerNavbar from '../EmployerNavbar';
import { createChatRoom } from '../../features/chat/chatSlice';

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
      console.log("Chat button clicked"); 
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
                    <TableCell>Email</TableCell>
                    <TableCell>Hiring Stage</TableCell>
                    <TableCell>Applied Date</TableCell>
                    <TableCell>Action</TableCell>
                    <TableCell>Chat</TableCell>
                    <TableCell>Profile</TableCell> {/* New Profile column */}
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
                      <TableCell>{applicant.job_seeker.user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={applicant.status || 'N/A'}
                          onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
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
                        <Button onClick={() => handleChat(applicant.job_seeker.user.id,userid)}> Chat</Button>
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handleClickOpen(applicant)}>Profile</Button> {/* Open profile modal */}
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
                <Typography variant="h6">{selectedApplicant.job_seeker.user.full_name}</Typography>
                <Typography variant="body1"><strong>Email:</strong> {selectedApplicant.job_seeker.user.email}</Typography>
                <Typography variant="body1"><strong>Phone Number:</strong> {selectedApplicant.job_seeker.phone_number}</Typography>
                <Typography variant="body1"><strong>Date of Birth:</strong> {new Date(selectedApplicant.job_seeker.date_of_birth).toLocaleDateString()}</Typography>
                <Typography variant="body1"><strong>Bio:</strong> {selectedApplicant.job_seeker.bio}</Typography>
                <Typography variant="body1"><strong>LinkedIn:</strong> {selectedApplicant.job_seeker.linkedin_url || 'N/A'}</Typography>
                <Typography variant="body1"><strong>Portfolio:</strong> {selectedApplicant.job_seeker.portfolio_url || 'N/A'}</Typography>
                <Typography variant="body1"><strong>Current Job Title:</strong> {selectedApplicant.job_seeker.current_job_title}</Typography>
                <Typography variant="body1"><strong>Job Preferences:</strong> {selectedApplicant.job_seeker.job_preferences}</Typography>
                <Typography variant="body1"><strong>Resume:</strong> <a href={`http://localhost:8000${selectedApplicant.job_seeker.resume}`} target="_blank" rel="noopener noreferrer">View Resume</a></Typography>
                
                {/* Additional details like educations, skills, etc. can be added here */}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ApplicantsList;