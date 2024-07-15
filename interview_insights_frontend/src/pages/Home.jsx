import React from 'react';
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
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../components/Navbar';

const featuredJobs = [
  { title: 'Software Engineer', company: 'Tech Co', location: 'New York, NY' },
  { title: 'Marketing Manager', company: 'Brand Inc', location: 'Los Angeles, CA' },
  { title: 'Data Analyst', company: 'Data Corp', location: 'Chicago, IL' },
  { title: 'UX Designer', company: 'Design Studio', location: 'San Francisco, CA' },
];

const Home = () => {
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

        <Grid container spacing={3}>
          {featuredJobs.map((job, index) => (
            <Grid item xs={12} sm={6} key={index}>
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
