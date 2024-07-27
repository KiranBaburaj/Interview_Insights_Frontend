import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchJobById, selectJobById } from '../features/jobs/jobsSlice'; // Adjust the path
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
} from '@mui/material';
import { Business, LocationOn, CalendarToday } from '@mui/icons-material';

const JobDetails = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const job = useSelector((state) => selectJobById(state, jobId));
  const jobsState = useSelector((state) => state.jobs);
  const jobStatus = useSelector((state) => state.jobs.status);
  const jobError = useSelector((state) => state.jobs.error);

  useEffect(() => {
    if (!job && jobStatus === 'idle') {
      dispatch(fetchJobById(jobId));
    }
  }, [job, jobId, dispatch, jobStatus]);

  if (jobStatus === 'loading') {
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

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
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
                Posted on: {new Date(job.created_at).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <LocationOn sx={{ verticalAlign: 'middle' }} /> {job.location}
              </Typography>
            </Grid>
            {job.responsibilities && (
              <Grid item xs={12}>
                <Typography variant="h6">Responsibilities:</Typography>
                <Typography variant="body1">{job.responsibilities}</Typography>
              </Grid>
            )}
            {job.qualifications && (
              <Grid item xs={12}>
                <Typography variant="h6">Qualifications:</Typography>
                <Typography variant="body1">{job.qualifications}</Typography>
              </Grid>
            )}
            {job.skills && job.skills.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6">Skills:</Typography>
                {job.skills.map((skill, index) => (
                  <Chip key={index} label={skill} sx={{ mr: 1, mt: 1 }} />
                ))}
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default JobDetails;
