import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, selectAllJobs, saveJob, unsaveJob, fetchSavedJobs, selectSavedJobs } from '../features/jobs/jobsSlice'; // Adjust the path
import { Link } from 'react-router-dom';
import { 
  Container, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardActions,
  Box,
  CircularProgress,
  Typography,
  Divider,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Navbar from '../components/Navbar';

const Home = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);
  const savedJobs = useSelector(selectSavedJobs); // Select saved jobs
  const jobsStatus = useSelector((state) => state.jobs.status);
  const jobsError = useSelector((state) => state.jobs.error);
  const [searchQuery, setSearchQuery] = useState('');
  const [savingStatus, setSavingStatus] = useState('idle'); // To handle saving status

  useEffect(() => {
    dispatch(fetchJobs(searchQuery)); // Fetch jobs with searchQuery
    dispatch(fetchSavedJobs()); // Fetch saved jobs on component mount
  }, [searchQuery, dispatch]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    dispatch(fetchJobs(searchQuery)); // Trigger fetchJobs with searchQuery
  };

  const isJobSaved = (jobId) => {
    // Check if the job is in the savedJobs list
    return savedJobs.some(job => job.job === jobId); // Adjust to match your data structure
  };

  const handleSaveJob = async (job) => {
    if (isJobSaved(job.id)) {
      setSavingStatus('loading');
      await dispatch(unsaveJob(job.id)); // Dispatch unsaveJob action
      setSavingStatus('idle');
    } else {
      setSavingStatus('loading');
      await dispatch(saveJob(job.id)); // Dispatch saveJob action
      setSavingStatus('idle');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 4, 
            px: 3, 
            py: 2, 
            backgroundColor: '#f5f5f5', 
            borderRadius: 2, 
            boxShadow: 1 
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for jobs..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ mr: 2 }}
            size="small"
            InputProps={{
              style: {
                padding: '10px 12px'
              }
            }}
          />
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            size="small"
            sx={{ 
              borderRadius: '20px',
              px: 3
            }}
          >
            Search
          </Button>
        </Box>

        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Featured Jobs
        </Typography>

        {jobsStatus === 'loading' ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : jobsStatus === 'failed' ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography color="error">Error: {jobsError}</Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Card
                  elevation={4}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isJobSaved(job.id) ? '#e3f2fd' : 'white', // Apply blue background for saved jobs
                    transition: 'background-color 0.3s'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {job.title}
                    </Typography>
                    <Typography color="textSecondary" variant="body2" gutterBottom>
                      {job.company.name} - {job.location}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      {job.description.substring(0, 30)}...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" component={Link} to={`/job/${job.id}`} sx={{ borderRadius: 20 }}>
                      Learn More
                    </Button>
                    <IconButton 
                      onClick={() => handleSaveJob(job)} 
                      sx={{ ml: 'auto' }} 
                      disabled={savingStatus === 'loading'}
                    >
                      {isJobSaved(job.id) ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Box component="footer" sx={{ bgcolor: 'background.paper', p: 4, mt: 6, textAlign: 'center', borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="body2" color="text.secondary">
          © 2024 Job Portal. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Home;
