import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchJobById, selectJobById } from '../features/jobs/jobsSlice';
import { fetchProfile } from '../features/jobseeker/jobseekerSlice2';
import {
  applyForJob,
  checkApplicationStatus,
  selectUserApplicationStatus,
  clearApplicationError,
  clearUserApplicationStatus,
} from '../features/jobapplication/jobApplicationSlice';
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
} from '@mui/icons-material';
import Navbar from './Navbar';
import { getOrCreateChatRoom,createChatRoom } from '../features/chat/chatSlice'; // Add this import
import { useNavigate } from 'react-router-dom';


const JobDetails = () => {
  // Inside your JobDetails component
const navigate = useNavigate();
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const job = useSelector((state) => selectJobById(state, jobId));
  const jobStatus = useSelector((state) => state.jobs.status);
  const jobError = useSelector((state) => state.jobs.error);
  const applicationStatus = useSelector((state) => state.applications.status);
  const applicationError = useSelector((state) => state.applications.error);
  const userApplicationStatus = useSelector(selectUserApplicationStatus);
  const userProfile = useSelector((state) => state.profile.data);
  const userid = useSelector(state => state.auth.userid);
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [customResume, setCustomResume] = useState(null);

  useEffect(() => {
    if (!job && jobStatus === 'idle') {
      dispatch(fetchJobById(jobId));
    }
    dispatch(fetchProfile());
  }, [job, jobId, dispatch, jobStatus]);

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
    }
  }, [applicationStatus]);

  const handleApply = () => {
    setIsApplying(true);

    const resume = useProfileResume ? userProfile.resume : customResume;
    dispatch(applyForJob({ jobId, resume, cover_letter: coverLetter, use_profile_resume: useProfileResume }));
  };

  const handleChat = () => {
    // Assuming userProfile.id is the jobseeker's ID and job.employerId is the employer's ID
    if (userid && job.employer) {
      dispatch(createChatRoom({ jobseekerId: userid, employerId: job.employer }))
        .unwrap()
        .then(() => {
          // Navigate to the chat page after successfully creating the chat room
          navigate('/chat'); // Adjust the path as needed
        })
        .catch((error) => {
          console.error('Failed to create chat room:', error);
        });
    }
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

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Navbar />
      <Card>
        <CardHeader
          title={job.title}
          subheader={`${job.company} - ${job.location}`}
          avatar={<Business />}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">{job.description}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <CalendarToday sx={{ verticalAlign: 'middle' }} />{' '}
                Posted on: {isPostedDateValid ? postedDate.toLocaleDateString() : 'Invalid date'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <DateRange sx={{ verticalAlign: 'middle' }} />{' '}
                Application Deadline: {isDeadlineDateValid ? deadlineDate.toLocaleDateString() : 'Invalid date'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <LocationOn sx={{ verticalAlign: 'middle' }} /> {job.location}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <AttachMoney sx={{ verticalAlign: 'middle' }} />{' '}
                Salary: ${job.salary_min} - ${job.salary_max}
              </Typography>
            </Grid>
            {job.skills && job.skills.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6">Skills:</Typography>
                {job.skills.map((skill, index) => (
                  <Chip key={index} label={skill} sx={{ mr: 1, mt: 1 }} />
                ))}
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
        
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
            
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Status: {job.status}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {showError && (
                <Alert severity="error">{applicationError}</Alert>
              )}
              {showSuccess && (
                <Alert severity="success">Application submitted successfully!</Alert>
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useProfileResume}
                    onChange={(e) => setUseProfileResume(e.target.checked)}
                    disabled={isApplying || userApplicationStatus.hasApplied}
                  />
                }
                label="Use resume from profile"
              />
              {!useProfileResume && (
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setCustomResume(e.target.files[0])}
                  disabled={isApplying || userApplicationStatus.hasApplied}
                />
              )}
              <TextField
                label="Cover Letter"
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                disabled={isApplying || userApplicationStatus.hasApplied}
                sx={{ mt: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleApply}
                disabled={isApplying || userApplicationStatus.hasApplied}
                sx={{ mt: 2 }}
              >
                {isApplying ? 'Applying...' : 'Apply'}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleChat}
                sx={{ mt: 2, ml: 2 }}
                disabled={isApplying}
              >
                Chat with Employer
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default JobDetails;
