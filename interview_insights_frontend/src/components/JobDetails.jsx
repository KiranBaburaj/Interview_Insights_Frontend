import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchJobById, selectJobById } from '../features/jobs/jobsSlice';
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
} from '@mui/material';
import {
  Business,
  LocationOn,
  CalendarToday,
  AttachMoney,
  DateRange,
} from '@mui/icons-material';
import Navbar from './Navbar';

const JobDetails = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const job = useSelector((state) => selectJobById(state, jobId));
  const jobStatus = useSelector((state) => state.jobs.status);
  const jobError = useSelector((state) => state.jobs.error);
  const applicationStatus = useSelector((state) => state.applications.status);
  const applicationError = useSelector((state) => state.applications.error);
  const userApplicationStatus = useSelector(selectUserApplicationStatus);

  const [resumeUrl, setResumeUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false); // Local state for immediate button disable

  useEffect(() => {
    if (!job && jobStatus === 'idle') {
      dispatch(fetchJobById(jobId));
    }
  }, [job, jobId, dispatch, jobStatus]);

  useEffect(() => {
    if (job) {
      dispatch(checkApplicationStatus(jobId));
    }
  }, [job, dispatch, jobId,isApplying]);

  useEffect(() => {
    if (applicationStatus === 'failed' || userApplicationStatus.status === 'failed') {
      const timer = setTimeout(() => {
        dispatch(clearApplicationError());
        dispatch(clearUserApplicationStatus());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [applicationStatus, userApplicationStatus, dispatch]);

  useEffect(() => {
    if (applicationStatus === 'succeeded') {
      setIsApplying(false); // Reset the local state after successful application
    }
  }, [applicationStatus]);

  const handleApply = () => {
    setIsApplying(true);
    dispatch(applyForJob({ jobId, resume_url: resumeUrl, cover_letter: coverLetter }));
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
      <Navbar/>
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
                Applications: {job.applications_count}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Views: {job.views_count}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Status: {job.status}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {applicationStatus === 'failed' && (
                <Alert severity="error">{applicationError}</Alert>
              )}
              {applicationStatus === 'succeeded' && (
                <Alert severity="success">Application submitted successfully!</Alert>
              )}
              <TextField
                label="Resume URL"
                fullWidth
                variant="outlined"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                sx={{ mb: 2 }}
                disabled={isApplying || userApplicationStatus.hasApplied}
              />
              <TextField
                label="Cover Letter"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                sx={{ mb: 2 }}
                disabled={isApplying || userApplicationStatus.hasApplied}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleApply}
                disabled={isApplying || userApplicationStatus.hasApplied}
              >
                {userApplicationStatus.hasApplied ? 'Already Applied' : isApplying ? 'Applying...' : 'Apply'}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default JobDetails;
