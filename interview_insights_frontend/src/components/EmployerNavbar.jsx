import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Avatar,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home'; // Import Home icon
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, logout } from '../features/auth/authSlice';
import NotificationList from './NotificationList'; // Import NotificationList

const drawerWidth = 240;

const EmployerNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { full_name } = useSelector((state) => state.auth); // Assuming user information is in auth state

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearError());
    navigate('/login');
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
        Interview Insights
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: '#b2dfdb' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', color: '#b2dfdb' }}>
          {full_name ? full_name : 'Guest'} {/* Display user name or 'Guest' */}
        </Typography>
      </Box>
      <Divider />
      <List>
        <NotificationList />
        <ListItem button component={Link} to="/dashboard/employer" sx={{ '&:hover': { backgroundColor: '#00796b' } }}>
          <ListItemIcon>
            <DashboardIcon sx={{ color: '#b2dfdb' }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" primaryTypographyProps={{ style: { fontWeight: 'bold', color: '#b2dfdb' } }} />
        </ListItem>
        <ListItem button component={Link} to="/" sx={{ '&:hover': { backgroundColor: '#00796b' } }}>
          <ListItemIcon>
            <HomeIcon sx={{ color: '#b2dfdb' }} /> {/* Use Home icon for Home */}
          </ListItemIcon>
          <ListItemText primary="Home" primaryTypographyProps={{ style: { fontWeight: 'bold', color: '#b2dfdb' } }} />
        </ListItem>
        <ListItem button component={Link} to="/EmployerJobManagement" sx={{ '&:hover': { backgroundColor: '#00796b' } }}>
          <ListItemIcon>
            <BusinessIcon sx={{ color: '#b2dfdb' }} />
          </ListItemIcon>
          <ListItemText primary="Jobs" primaryTypographyProps={{ style: { fontWeight: 'bold', color: '#b2dfdb' } }} />
        </ListItem>
        <ListItem button component={Link} to="/EmployerCompanyManagement" sx={{ '&:hover': { backgroundColor: '#00796b' } }}>
          <ListItemIcon>
            <PeopleIcon sx={{ color: '#b2dfdb' }} /> {/* Changed to PeopleIcon for Company Management */}
          </ListItemIcon>
          <ListItemText primary="Company" primaryTypographyProps={{ style: { fontWeight: 'bold', color: '#b2dfdb' } }} />
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

export default EmployerNavbar;