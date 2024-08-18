import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Container,
  MenuItem,
  Menu,
  Fade,
  Slide,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ChatIcon from '@mui/icons-material/Chat';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearError, logout } from '../features/auth/authSlice';
import NotificationList from './NotificationList';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b', // Deep teal for primary color
    },
    secondary: {
      main: '#b2dfdb', // Light teal for secondary color
    },
    text: {
      primary: '#ffffff', // White text for Navbar
      menu: '#000000', // Black text for Menu Items
    },
  },
});

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, role } = useSelector((state) => state.auth);
  console.log(user)

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
    if (user) {
      navigate(role === 'employer' ? '/Employer/chat' : '/chat');
    } else {
      navigate('/login');
    }
    handleClose();
  };

  const handleDashboardNavigation = () => {
    const dashboardPath = role === 'jobseeker' ? '/dashboard/jobseeker' :
                          role === 'employer' ? '/dashboard/employer' :
                          role === 'recruiter' ? '/dashboard/recruiter' : '/';
    if (user) {
      navigate(dashboardPath);
    } else {
      navigate('/login');
    }
    handleClose();
  };

  const avatarImageUrl = '/logo.PNG';

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={avatarImageUrl} sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ display: { xs: 'none', md: 'block' }, color: 'white' }}>
                Interview Insights
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 4 }}>
                <Button color="inherit" onClick={() => navigate('/')} sx={{ '&:hover': { backgroundColor: '#004d40', transition: '0.3s' } }}>
                  <HomeIcon sx={{ mr: 1 }} />
                  Home
                </Button>

                <Button color="inherit" onClick={handleChatNavigation} sx={{ '&:hover': { backgroundColor: '#004d40', transition: '0.3s' } }}>
                  <ChatIcon sx={{ mr: 1 }} />
                  Chat
                </Button>

                <Button color="inherit" onClick={handleDashboardNavigation} sx={{ '&:hover': { backgroundColor: '#004d40', transition: '0.3s' } }}>
                  <DashboardIcon sx={{ mr: 1 }} />
                  Dashboard
                </Button>
              </Box>

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
              <Fade in={Boolean(anchorEl)}>
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
                  <Slide direction="down" in={Boolean(anchorEl)} mountOnEnter unmountOnExit>
                    <Box>
                      <MenuItem onClick={() => navigate('/')} sx={{ color: theme.palette.text.menu }}>
                        <HomeIcon sx={{ mr: 1 }} />
                        Home
                      </MenuItem>

                      <MenuItem onClick={handleChatNavigation} sx={{ color: theme.palette.text.menu }}>
                        <ChatIcon sx={{ mr: 1 }} />
                        Chat
                      </MenuItem>

                      <MenuItem onClick={handleDashboardNavigation} sx={{ color: theme.palette.text.menu }}>
                        <DashboardIcon sx={{ mr: 1 }} />
                        Dashboard
                      </MenuItem>

                      {user ? (
                        <>
                          <MenuItem onClick={() => navigate('/profile')} sx={{ color: theme.palette.text.menu }}>
                            <AccountCircleIcon sx={{ mr: 1 }} />
                            Profile
                          </MenuItem>
                          <MenuItem onClick={handleLogout} sx={{ color: theme.palette.text.menu }}>
                            <ExitToAppIcon sx={{ mr: 1 }} />
                            Logout
                          </MenuItem>
                        </>
                      ) : (
                        <MenuItem onClick={() => navigate('/login')} sx={{ color: theme.palette.text.menu }}>
                          <AccountCircleIcon sx={{ mr: 1 }} />
                          Login
                        </MenuItem>
                      )}
                    </Box>
                  </Slide>
                </Menu>
              </Fade>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;