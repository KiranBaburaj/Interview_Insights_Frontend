import React from 'react';
import { useSelector } from 'react-redux';
import { Box, CssBaseline, Toolbar, Typography, Card, CardContent, Grid, Avatar, Divider, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import EmployerNavbar from '../../components/EmployerNavbar';
import { AccessTime, WorkOutline } from '@mui/icons-material';

const EmployerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <EmployerNavbar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - 240px)` } }}
      >
        <Toolbar />
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user ? user.full_name : 'Employer'}
        </Typography>

        {/* Dashboard Content */}
        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ marginTop: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  Total Jobs Posted
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                  <WorkOutline sx={{ fontSize: 40, marginRight: 2 }} />
                  <Typography variant="h3">20</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  Applications Received
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                  <AccessTime sx={{ fontSize: 40, marginRight: 2 }} />
                  <Typography variant="h3">150</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" component="div">
                  Applications Status
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex', marginTop: 2 }}>
                  <CircularProgress variant="determinate" value={70} size={100} />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" component="div" color="text.secondary">
                      70%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Reviewed
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  30% Pending
                </Typography>
                <Button variant="text" sx={{ marginTop: 2 }}>
                  View All Applications
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Upcoming Interviews */}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            Upcoming Interviews
          </Typography>
          <Card>
            <CardContent>
              <List>
                <ListItem>
                  <Avatar alt="Joe Bartmann" src="https://via.placeholder.com/40" />
                  <ListItemText
                    primary="Joe Bartmann"
                    secondary="HR Manager at Divvy"
                    sx={{ marginLeft: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    10:00 AM
                  </Typography>
                </ListItem>
                <Divider />
                {/* Add more ListItems as needed */}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Applications */}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" gutterBottom>
            Recent Applications History
          </Typography>
          <Card>
            <CardContent>
              <List>
                <ListItem>
                  <WorkOutline />
                  <ListItemText
                    primary="Software Engineer"
                    secondary="Date Applied: 12 August"
                    sx={{ marginLeft: 2 }}
                  />
                </ListItem>
                <Divider />
                {/* Add more ListItems as needed */}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default EmployerDashboard;
