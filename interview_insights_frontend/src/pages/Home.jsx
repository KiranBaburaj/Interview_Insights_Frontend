import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, selectAllJobs } from '../features/jobs/jobsSlice'; // Adjust the path
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
  Paper,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../components/Navbar';

const Home = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);
  const jobsStatus = useSelector((state) => state.jobs.status);
  const jobsError = useSelector((state) => state.jobs.error);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchJobs(searchQuery)); // Pass searchQuery to fetchJobs
  }, [searchQuery, dispatch]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    dispatch(fetchJobs(searchQuery)); // Trigger fetchJobs with searchQuery
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
                <Card elevation={4} sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {job.title}
                    </Typography>
                    <Typography color="textSecondary" variant="body2" gutterBottom>
                      {job.company.name} - {job.location}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      {job.description.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" component={Link} to={`/job/${job.id}`} sx={{ borderRadius: 20 }}>
                      Learn More
                    </Button>
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
