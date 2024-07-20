import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, selectAllJobs } from '../features/jobs/jobsSlice'; // Adjust the path
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardActions,
  Box,
  CircularProgress,
  Typography as MuiTypography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../components/Navbar';
const Home = () => {
  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);
  const jobsStatus = useSelector((state) => state.jobs.status);
  const jobsError = useSelector((state) => state.jobs.error);

  useEffect(() => {
    if (jobsStatus === 'idle') {
      dispatch(fetchJobs());
    }
  }, [jobsStatus, dispatch]);

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for jobs..."
            sx={{ mr: 1 }}
          />
          <Button variant="contained" startIcon={<SearchIcon />}>
            Search
          </Button>
        </Box>

        <Typography variant="h4" gutterBottom>
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
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} sm={6} key={job.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {job.title}
                    </Typography>
                    <Typography color="textSecondary" variant="body2" gutterBottom>
                      {job.company} - {job.location}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Learn More
                    </Button>
                    <Button size="small" variant="contained" color="primary">
                      Apply
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Box component="footer" sx={{ bgcolor: 'background.paper', p: 6, mt: 4 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          © 2024 Job Portal. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Home;
