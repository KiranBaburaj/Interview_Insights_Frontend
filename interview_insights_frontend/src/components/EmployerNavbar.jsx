import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearError } from '../features/auth/authSlice';

const drawerWidth = 240;

const EmployerNavbar = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearError());

      state.user = null;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.userid = null;
      state.full_name = null;
      state.companyDetailsSubmitted = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      localStorage.removeItem('userid');
      localStorage.removeItem('full_name');
      localStorage.removeItem('companyDetailsSubmitted');
    window.location.replace('/login');
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
          <ListItemText primary="home" />
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
