import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Container,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearError, logout } from '../features/auth/authSlice';
import { fetchNotifications, markNotificationAsRead } from '../features/notifications/notificationSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const userMenuOpen = Boolean(userMenuAnchorEl);
  const notificationMenuOpen = Boolean(notificationAnchorEl);

  const { user, role } = useSelector((state) => state.auth);
  const notifications = useSelector((state) => state.notifications.notifications);
  const unreadCount = notifications.filter(notification => !notification.is_read).length;

  useEffect(() => {
    // Fetch initial notifications
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUserMenu = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearError());
    navigate('/login');
    handleUserMenuClose();
  };

  const handleNotificationClick = (notification) => {
    dispatch(markNotificationAsRead(notification.id));
    handleNotificationMenuClose();
    navigate('/notifications'); // Redirect to a notifications page or detail view
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>JP</Avatar>
            <Typography variant="h6" component="div" sx={{ display: { xs: 'none', md: 'block' } }}>
              Job Portal
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
              <Button color="inherit" onClick={() => navigate('/contact')}>
                Contact
              </Button>
            </Box>

            <IconButton
              color="inherit"
              onClick={handleNotificationMenu}
              sx={{ ml: 2 }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <Menu
              anchorEl={notificationAnchorEl}
              open={notificationMenuOpen}
              onClose={handleNotificationMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                style: {
                  maxHeight: 300,
                },
              }}
            >
              {notifications.map(notification => (
                <MenuItem key={notification.id} onClick={() => handleNotificationClick(notification)}>
                  {notification.message}
                </MenuItem>
              ))}
            </Menu>

            {user ? (
              <>
                <Tooltip title="Profile">
                  <IconButton
                    color="inherit"
                    onClick={handleUserMenu}
                    sx={{ ml: 2 }}
                  >
                    <Avatar />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={userMenuAnchorEl}
                  open={userMenuOpen}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
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
                </Menu>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{ ml: 2 }}
              >
                Login
              </Button>
            )}

            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Home</MenuItem>
                <MenuItem onClick={handleClose}>Jobs</MenuItem>
                <MenuItem onClick={handleClose}>Companies</MenuItem>
                <MenuItem onClick={handleClose}>About</MenuItem>
                <MenuItem onClick={handleClose}>Contact</MenuItem>
                {user ? (
                  <MenuItem onClick={handleLogout}>Logout ({user.full_name})</MenuItem>
                ) : (
                  <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
                )}
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
