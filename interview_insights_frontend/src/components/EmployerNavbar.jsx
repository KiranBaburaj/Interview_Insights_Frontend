import React, { useState } from 'react';
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
  IconButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, logout } from '../features/auth/authSlice';
import NotificationList from './NotificationList';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

const EmployerNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { full_name } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearError());
    navigate('/login');
  };

  const avatarImageUrl = '/logo.PNG';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box>
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
          {full_name ? full_name : 'Guest'}
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
            <HomeIcon sx={{ color: '#b2dfdb' }} />
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
            <PeopleIcon sx={{ color: '#b2dfdb' }} />
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
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {isMobile ? (
        <>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor: '#004d40',
                color: '#fff',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#004d40',
              color: '#fff',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </Box>
  );
};

export default EmployerNavbar;
