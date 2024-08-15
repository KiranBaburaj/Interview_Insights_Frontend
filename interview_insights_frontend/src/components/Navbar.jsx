import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Container,
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearError, logout } from '../features/auth/authSlice';
import NotificationList from './NotificationList';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, role } = useSelector((state) => state.auth);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearError());
    navigate('/login');
  };

  const handleChatNavigation = () => {
    if (role === 'employer') {
      navigate('/Employer/chat');
    } else {
      navigate('/chat');
    }
    handleClose();
  };

  const avatarImageUrl = '/logo.PNG';

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src={avatarImageUrl} sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ display: { xs: 'none', md: 'block' } }}>
              Interview Insights
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 4 }}>
              <Button color="inherit" onClick={() => navigate('/')}>
                Home
              </Button>
              <Button color="inherit" onClick={() => navigate('/jobs')}>
                Jobs
              </Button>
              <Button color="inherit" onClick={() => navigate('/companies')}>
                Companies
              </Button>
              <Button color="inherit" onClick={() => navigate('/about')}>
                About
              </Button>
              {(role === 'jobseeker' || role === 'employer') && (
                <Button color="inherit" onClick={handleChatNavigation}>
                  Chat
                </Button>
              )}
            </Box>

            {/* Include NotificationList component */}
            <NotificationList />

            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenu}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
              <MenuItem onClick={() => navigate('/jobs')}>Jobs</MenuItem>
              <MenuItem onClick={() => navigate('/companies')}>Companies</MenuItem>
              <MenuItem onClick={() => navigate('/about')}>About</MenuItem>
              {(role === 'jobseeker' || role === 'employer') && (
                <MenuItem onClick={handleChatNavigation}>Chat</MenuItem>
              )}
              {user ? (
                <>
                  <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  {role === 'jobseeker' && (
                    <MenuItem onClick={() => navigate('/dashboard/jobseeker')}>
                      Dashboard
                    </MenuItem>
                  )}
                  {role === 'employer' && (
                    <MenuItem onClick={() => navigate('/dashboard/employer')}>
                      Employer Dashboard
                    </MenuItem>
                  )}
                  {role === 'recruiter' && (
                    <MenuItem onClick={() => navigate('/dashboard/recruiter')}>
                      Recruiter Dashboard
                    </MenuItem>
                  )}
                </>
              ) : (
                <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
