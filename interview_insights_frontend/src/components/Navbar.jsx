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
import theme from '../theme/theme';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, role } = useSelector((state) => state.auth);
  console.log(user)
  console.log(role)


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
      <AppBar position="static" sx={{ 
        background: theme.palette.common.purple.gradient,
        boxShadow: theme.palette.common.purple.shadow
      }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={avatarImageUrl} sx={{ 
                mr: 2, 
                border: '2px solid #9c4dcc',
                boxShadow: '0 0 4px rgba(156, 77, 204, 0.5)'
              }} />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  display: { xs: 'none', md: 'block' }, 
                  color: 'white',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                }}>
                Interview Insights
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 4 }}>
                <Button color="inherit" onClick={() => navigate('/')} sx={{ 
                  '&:hover': { 
                    backgroundColor: theme.palette.common.purple.hover, 
                    transition: 'all 0.3s ease' 
                  },
                  borderRadius: '8px',
                  mx: 0.5,
                }}>
                  <HomeIcon sx={{ mr: 1 }} />
                  Home
                </Button>

                <Button color="inherit" onClick={handleChatNavigation} sx={{ 
                  '&:hover': { 
                    backgroundColor: theme.palette.common.purple.hover, 
                    transition: 'all 0.3s ease' 
                  },
                  borderRadius: '8px',
                  mx: 0.5,
                }}>
                  <ChatIcon sx={{ mr: 1 }} />
                  Chat
                </Button>

                <Button color="inherit" onClick={handleDashboardNavigation} sx={{ 
                  '&:hover': { 
                    backgroundColor: theme.palette.common.purple.hover, 
                    transition: 'all 0.3s ease' 
                  },
                  borderRadius: '8px',
                  mx: 0.5,
                }}>
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
                sx={{ 
                  ml: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(156, 77, 204, 0.2)'
                  }
                }}
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
                  PaperProps={{
                    sx: {
                      bgcolor: theme.palette.background.paper,
                      '& .MuiMenuItem-root:hover': {
                        bgcolor: theme.palette.background.light,
                      }
                    }
                  }}
                >
                  <Slide direction="down" in={Boolean(anchorEl)} mountOnEnter unmountOnExit>
                    <Box>
                      <MenuItem onClick={() => navigate('/')} sx={{ color: theme.palette.text.menu, py: 1.5 }}>
                        <HomeIcon sx={{ mr: 1 }} />
                        Home
                      </MenuItem>

                      <MenuItem onClick={handleChatNavigation} sx={{ color: theme.palette.text.menu, py: 1.5 }}>
                        <ChatIcon sx={{ mr: 1 }} />
                        Chat
                      </MenuItem>

                      <MenuItem onClick={handleDashboardNavigation} sx={{ color: theme.palette.text.menu, py: 1.5 }}>
                        <DashboardIcon sx={{ mr: 1 }} />
                        Dashboard
                      </MenuItem>

                      {user ? (
                        <>
             
                          <MenuItem onClick={handleLogout} sx={{ color: theme.palette.text.menu, py: 1.5 }}>
                            <ExitToAppIcon sx={{ mr: 1 }} />
                            Logout
                          </MenuItem>
                        </>
                      ) : (
                        <MenuItem onClick={() => navigate('/login')} sx={{ color: theme.palette.text.menu, py: 1.5 }}>
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