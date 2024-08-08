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
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearError, logout } from '../features/auth/authSlice';
import { fetchNotifications, markNotificationAsRead } from '../features/notifications/notificationSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const userMenuOpen = Boolean(userMenuAnchorEl);
  const notificationMenuOpen = Boolean(notificationAnchorEl);

  const { user, role } = useSelector((state) => state.auth);
  const notifications = useSelector((state) => state.notifications.notifications);
  const unreadCount = notifications.filter(notification => !notification.is_read).length;

  useEffect(() => {
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

  const handleChatNavigation = () => {
    if (role === 'employer') {
      navigate('/Employer/chat');
    } else {
      navigate('/chat');
    }
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
                <MenuItem onClick={() => navigate('/')}>Home</MenuItem>
                <MenuItem onClick={() => navigate('/jobs')}>Jobs</MenuItem>
                <MenuItem onClick={() => navigate('/companies')}>Companies</MenuItem>
                <MenuItem onClick={() => navigate('/about')}>About</MenuItem>
                {(role === 'jobseeker' || role === 'employer') && (
                  <MenuItem onClick={handleChatNavigation}>Chat</MenuItem>
                )}
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
