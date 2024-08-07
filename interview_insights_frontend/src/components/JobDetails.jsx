import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
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
  Work,
  Assignment,
  AssignmentInd,
  VerifiedUser,
  Home,
  Layers,
} from '@mui/icons-material';
import Navbar from './Navbar';
import { createChatRoom } from '../features/chat/chatSlice';

const JobDetails = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
          subheader={`${job.company.name} - ${job.location}`}
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
                <CalendarToday sx={{ verticalAlign: 'middle' }} /> Posted on: {isPostedDateValid ? postedDate.toLocaleDateString() : 'Invalid date'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <DateRange sx={{ verticalAlign: 'middle' }} /> Application Deadline: {isDeadlineDateValid ? deadlineDate.toLocaleDateString() : 'Invalid date'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <LocationOn sx={{ verticalAlign: 'middle' }} /> {job.location}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <AttachMoney sx={{ verticalAlign: 'middle' }} /> Salary: ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Assignment sx={{ verticalAlign: 'middle' }} /> Responsibilities:
              </Typography>
              <Typography variant="body2" color="textSecondary">{job.responsibilities}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <VerifiedUser sx={{ verticalAlign: 'middle' }} /> Qualifications:
              </Typography>
              <Typography variant="body2" color="textSecondary">{job.qualifications}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <AssignmentInd sx={{ verticalAlign: 'middle' }} /> Nice to Have:
              </Typography>
              <Typography variant="body2" color="textSecondary">{job.nice_to_have}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Work sx={{ verticalAlign: 'middle' }} /> Employment Type:
              </Typography>
              <Typography variant="body2" color="textSecondary">{job.employment_type}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Layers sx={{ verticalAlign: 'middle' }} /> Experience Level:
              </Typography>
              <Typography variant="body2" color="textSecondary">{job.experience_level}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Work sx={{ verticalAlign: 'middle' }} /> Job Function:
              </Typography>
              <Typography variant="body2" color="textSecondary">{job.job_function}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Home sx={{ verticalAlign: 'middle' }} /> Remote:
              </Typography>
              <Typography variant="body2" color="textSecondary">{job.is_remote ? 'Yes' : 'No'}</Typography>
            </Grid>
            {job.skills && job.skills.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Skills:</Typography>
                {job.skills.map((skill, index) => (
                  <Chip key={index} label={skill} sx={{ mr: 1, mb: 1 }} />
                ))}
              </Grid>
            )}
            <Grid item xs={12}>
              {showError && (
                <Alert severity="error" onClose={() => setShowError(false)}>
                  {applicationError || userApplicationStatus.error}
                </Alert>
              )}
              {showSuccess && (
                <Alert severity="success" onClose={() => setShowSuccess(false)}>
                  Application submitted successfully!
                </Alert>
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useProfileResume}
                    onChange={(e) => setUseProfileResume(e.target.checked)}
                    disabled={isApplying || userApplicationStatus.hasApplied}
                  />
                }
                label="Use profile resume"
              />
              {!useProfileResume && (
                <TextField
                  type="file"
                  onChange={(e) => setCustomResume(e.target.files[0])}
                  disabled={isApplying || userApplicationStatus.hasApplied}
                />
              )}
              <TextField
                label="Cover Letter"
                multiline
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
                disabled={isApplying || userApplicationStatus.hasApplied}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleApply}
                disabled={isApplying || userApplicationStatus.hasApplied}
              >
                {userApplicationStatus.hasApplied ? 'Already Applied' : 'Apply Now'}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleChat}
                disabled={!job.employer || !userid}
                sx={{ ml: 2 }}
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
