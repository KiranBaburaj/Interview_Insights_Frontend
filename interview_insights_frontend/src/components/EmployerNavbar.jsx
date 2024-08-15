import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  IconButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearError, logout } from '../features/auth/authSlice';
import NotificationList from './NotificationList'; // Import NotificationList

const drawerWidth = 240;

const EmployerNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearError());
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
      <NotificationList />
        <ListItem button component={Link} to="/dashboard/employer">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/EmployerJobManagement">
          <ListItemIcon>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText primary="My Jobs" />
        </ListItem>
        <ListItem button component={Link} to="/applicants">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Applicants" />
        </ListItem>
        <ListItem button component={Link} to="/interviews">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Interviews" />
        </ListItem>
        <ListItem button component={Link} to="/EmployerCompanyManagement">
          <ListItemIcon>
            <BusinessIcon />
          </ListItemIcon>
          <ListItemText primary="Company Management" />
        </ListItem>

        {/* Include NotificationList component */}

        
      </List>
      <Divider />
      <ListItem button onClick={handleLogout}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </Drawer>
  );
};

export default EmployerNavbar;
