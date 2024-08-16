import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider, Box, Avatar, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError } from '../../features/auth/authSlice';

const drawerWidth = 240;

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const { full_name } = useSelector((state) => state.auth); // Assuming user information is in auth state

  const handleLogout = () => {
    dispatch(clearError());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    window.location.replace('/login');
  };

  const avatarImageUrl = '/logo.PNG'; // Path to avatar image

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          backgroundColor: '#004d40', // Dark teal background
          color: '#fff', // White text
        },
      }}
    >
      <Toolbar />
      <Divider sx={{ backgroundColor: '#b2dfdb' }} />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
          <Avatar src={avatarImageUrl} sx={{ width: 56, height: 56, mr: 1 }} />
        </Box>
        <Typography variant="h5" noWrap sx={{ fontWeight: 'bold', color: '#b2dfdb' }}>
          Admin Dashboard
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: '#b2dfdb' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', color: '#b2dfdb' }}>
          { 'Admin'} {/* Display user name or 'Admin' */}
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/admindashboard" sx={{ '&:hover': { backgroundColor: '#00796b' } }}>
          <ListItemIcon>
            <DashboardIcon sx={{ color: '#b2dfdb' }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" primaryTypographyProps={{ style: { fontWeight: 'bold', color: '#b2dfdb' } }} />
        </ListItem>
        <ListItem button component={Link} to="/jobseekers" sx={{ '&:hover': { backgroundColor: '#00796b' } }}>
          <ListItemIcon>
            <PeopleIcon sx={{ color: '#b2dfdb' }} />
          </ListItemIcon>
          <ListItemText primary="Job Seekers" primaryTypographyProps={{ style: { fontWeight: 'bold', color: '#b2dfdb' } }} />
        </ListItem>
        <ListItem button component={Link} to="/employers" sx={{ '&:hover': { backgroundColor: '#00796b' } }}>
          <ListItemIcon>
            <PeopleIcon sx={{ color: '#b2dfdb' }} />
          </ListItemIcon>
          <ListItemText primary="Employers" primaryTypographyProps={{ style: { fontWeight: 'bold', color: '#b2dfdb' } }} />
        </ListItem>
        <ListItem button component={Link} to="/companies" sx={{ '&:hover': { backgroundColor: '#00796b' } }}>
          <ListItemIcon>
            <BusinessIcon sx={{ color: '#b2dfdb' }} />
          </ListItemIcon>
          <ListItemText primary="Companies" primaryTypographyProps={{ style: { fontWeight: 'bold', color: '#b2dfdb' } }} />
        </ListItem>
      </List>
      <Divider />
      <ListItem button onClick={handleLogout} sx={{ '&:hover': { backgroundColor: '#d32f2f' } }}>
        <ListItemIcon>
          <ExitToAppIcon sx={{ color: '#b2dfdb' }} />
        </ListItemIcon>
        <ListItemText primary="Logout" primaryTypographyProps={{ style: { fontWeight: 'bold', color: '#b2dfdb' } }} />
      </ListItem>
    </Drawer>
  );
};

export default AdminNavbar;