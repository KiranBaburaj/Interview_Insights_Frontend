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

  return (
    <ThemeProvider theme={theme}>
      <AppBar 
        position="static" 
        sx={{ 
          background: theme.palette.common.purple.gradient,
          boxShadow: theme.palette.common.purple.shadow,
          py: { xs: 1, sm: 1.5 }
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              pl: 0,
              minHeight: { xs: '56px', sm: '64px' }
            }}
          >
            <Box 
              component="a" 
              href="/"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                mr: { xs: 2, md: 16 },
                background: 'linear-gradient(to right, #ffffff, #f8f9fa)',
                padding: '10px 20px',
                borderRadius: '16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.8)',
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 70%)',
                  transform: 'translateX(-100%)',
                  transition: 'transform 0.6s',
                },
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  background: 'linear-gradient(to right, #ffffff, #f0f2f5)',
                  '&:before': {
                    transform: 'translateX(100%)',
                  }
                },
                '&:active': {
                  transform: 'translateY(1px)',
                }
              }}
            >
              <Box
                component="img"
                src="https://d3dxvti62y5mgw.cloudfront.net/ccp_logo_icon.webp"
                alt="Navigation Logo"
                sx={{
                  width: { xs: '38px', sm: '44px', md: '48px' },
                  height: 'auto',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  transform: 'translateZ(0)',
                  willChange: 'transform',
                }}
              />
              <Box
                sx={{
                  ml: { xs: 1.5, sm: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    fontFamily: '"Inter", sans-serif',
                    fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
                    color: '#1a1a1a',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    '& .gradient-text': {
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 900,
                      marginLeft: '1px'
                    }
                  }}
                >
                  CC<span className="gradient-text">P</span>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                    color: '#666',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    mt: '2px'
                  }}
                >
                  Career Campus Pro
                </Typography>
              </Box>
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