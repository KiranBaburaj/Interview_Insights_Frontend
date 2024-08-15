import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchJobs, 
  selectAllJobs, 
  saveJob, 
  unsaveJob, 
  fetchSavedJobs, 
  selectSavedJobs,
  fetchMatchingJobs,
  selectMatchingJobs
} from '../features/jobs/jobsSlice';
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
  IconButton,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import Navbar from '../components/Navbar';

const Home = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);
  const savedJobs = useSelector(selectSavedJobs);
  const matchingJobs = useSelector(selectMatchingJobs);
  const jobsStatus = useSelector((state) => state.jobs.status);
  const jobsError = useSelector((state) => state.jobs.error);
  const role = useSelector((state) => state.auth.role);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showMatchingOnly, setShowMatchingOnly] = useState(false);
  const [savingStatus, setSavingStatus] = useState({});
  const jobseeker_id = useSelector((state) => state.auth.userid);

  useEffect(() => {
    if (showSavedOnly && role !== 'employer') {
      dispatch(fetchSavedJobs());
    } else if (showMatchingOnly && role !== 'employer') {
      dispatch(fetchMatchingJobs());
    } else {
      dispatch(fetchJobs(searchQuery));
    }
  }, [showSavedOnly, showMatchingOnly, searchQuery, dispatch, role]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    dispatch(fetchJobs(searchQuery));
  };

  const handleSavedFilterChange = (event) => {
    setShowSavedOnly(event.target.checked);
    if (event.target.checked) {
      setShowMatchingOnly(false);
    }
  };

  const handleMatchingFilterChange = (event) => {
    setShowMatchingOnly(event.target.checked);
    if (event.target.checked) {
      setShowSavedOnly(false);
    }
  };

  const isJobSaved = (jobId) => {
    return savedJobs.some(savedJob => savedJob.job === jobId);
  };

  const handleSaveJob = async (job) => {
    setSavingStatus((prevStatus) => ({ ...prevStatus, [job.id]: 'loading' }));
    if (isJobSaved(job.id)) {
      await dispatch(unsaveJob(job.id));
    } else {
      await dispatch(saveJob(job.id));
    }
    await dispatch(fetchSavedJobs());
    setSavingStatus((prevStatus) => ({ ...prevStatus, [job.id]: 'idle' }));
  };

  // Get today's date for filtering
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  // Filter jobs to only show those that are open and not past their deadline
  const displayedJobs = showSavedOnly && role !== 'employer'
    ? jobs.filter(job => isJobSaved(job.id))
    : showMatchingOnly && role !== 'employer'
    ? matchingJobs
    : jobs.filter(job => job.status === 'open' && job.application_deadline >= today); // Only open jobs with valid deadline

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, px: 3, py: 2, backgroundColor: '#f5f5f5', borderRadius: 2, boxShadow: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for jobs..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ mr: 2 }}
            size="small"
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

        {role !== 'employer' && (
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showSavedOnly}
                  onChange={handleSavedFilterChange}
                  color="primary"
                />
              }
              label="Show Only Saved Jobs"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showMatchingOnly}
                  onChange={handleMatchingFilterChange}
                  color="primary"
                />
              }
              label="Show Only Matching Jobs"
            />
          </Box>
        )}

        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          {showSavedOnly ? 'Saved Jobs' : showMatchingOnly ? 'Matching Jobs' : 'Featured Jobs'}
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
            {displayedJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Card
                  elevation={4}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isJobSaved(job.id) ? '#e3f2fd' : 'white',
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
                    {role !== 'employer' && (
                      <IconButton 
                        onClick={() => handleSaveJob(job)} 
                        sx={{ ml: 'auto' }} 
                        disabled={savingStatus[job.id] === 'loading'}
                      >
                        {isJobSaved(job.id) ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
                      </IconButton>
                    )}
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