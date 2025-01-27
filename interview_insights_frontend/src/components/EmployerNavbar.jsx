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
  Typography,
  IconButton,
  ThemeProvider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError, logout } from '../features/auth/authSlice';
import NotificationList from './NotificationList';
import useMediaQuery from '@mui/material/useMediaQuery';
import theme from '../theme/theme';

const drawerWidth = 240;

const EmployerNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { full_name } = useSelector((state) => state.auth);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearError());
    navigate('/login');
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box sx={{ overflowX: 'hidden' }}>
      <Toolbar sx={{ minHeight: '40px !important' }} />
      <Divider />
      <Box sx={{ 
        py: 1, 
        px: 1.5,
        textAlign: 'center',
        background: theme.palette.common.purple.gradient,
        boxShadow: theme.palette.common.purple.shadow,
        mx: 1.5,
        borderRadius: 1,
        mb: 0.5,
        maxWidth: '100%'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            component="img"
            src="https://d3dxvti62y5mgw.cloudfront.net/ccp_logo_icon.webp"
            alt="Navigation Logo"
            sx={{
              width: '48px',
              height: 'auto',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          />
          <Typography
            variant="h4"
            sx={{
              ml: 2,
              fontWeight: 800,
              fontFamily: 'sans-serif',
              fontSize: '1.875rem',
              color: '#ffffff',
              '& .gradient-text': {
                background: 'linear-gradient(to top left, #2563eb, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }
            }}
          >
            CC<span className="gradient-text">P</span>
          </Typography>
        </Box>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        py: 0.75,
        px: 1.5,
        mx: 1.5,
        borderRadius: 1,
        background: '#f5f5f5',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxWidth: '100%'
      }}>
        <Typography variant="subtitle1" noWrap sx={{ 
          fontWeight: 'bold', 
          color: '#424242',
          fontSize: '0.9rem'
        }}>
          {full_name ? full_name : 'Guest'}
        </Typography>
      </Box>
      <List sx={{ py: 0.5 }}>
        <NotificationList />
        <ListItem 
          button 
          component={Link} 
          to="/dashboard/employer" 
          sx={{ 
            '&:hover': { 
              background: 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)',
              transform: 'translateX(4px)',
              boxShadow: '0 2px 4px rgba(156, 39, 176, .3)',
              '& .MuiListItemIcon-root': {
                transform: 'scale(1.1)',
                '& svg': {
                  color: '#fff'
                }
              },
              '& .MuiTypography-root': {
                color: '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }
            },
            transition: 'all 0.3s ease',
            borderRadius: 1,
            mx: 1,
            my: 0.25,
            minHeight: '36px',
            bgcolor: 'transparent',
            '& .MuiListItemIcon-root': {
              transition: 'transform 0.2s ease',
              minWidth: '36px'
            }
          }}
        >
          <ListItemIcon>
            <DashboardIcon sx={{ color: '#fff', fontSize: '1.3rem' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Dashboard" 
            primaryTypographyProps={{ 
              style: { 
                fontWeight: 'bold', 
                color: '#fff',
                fontSize: '1rem',
                letterSpacing: '0.3px'
              } 
            }} 
          />
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/employer/chat" 
          sx={{ 
            '&:hover': { 
              background: 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)',
              transform: 'translateX(4px)',
              boxShadow: '0 2px 4px rgba(156, 39, 176, .3)',
              '& .MuiListItemIcon-root': {
                transform: 'scale(1.1)',
                '& svg': {
                  color: '#fff'
                }
              },
              '& .MuiTypography-root': {
                color: '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }
            },
            transition: 'all 0.3s ease',
            borderRadius: 1,
            mx: 1,
            my: 0.25,
            minHeight: '36px',
            bgcolor: 'transparent',
            '& .MuiListItemIcon-root': {
              transition: 'transform 0.2s ease',
              minWidth: '36px'
            }
          }}
        >
          <ListItemIcon>
            <ChatIcon sx={{ color: '#fff', fontSize: '1.3rem' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Chat" 
            primaryTypographyProps={{ 
              style: { 
                fontWeight: 'bold', 
                color: '#fff',
                fontSize: '1rem',
                letterSpacing: '0.3px'
              } 
            }} 
          />
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/" 
          sx={{ 
            '&:hover': { 
              background: 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)',
              transform: 'translateX(4px)',
              boxShadow: '0 2px 4px rgba(156, 39, 176, .3)',
              '& .MuiListItemIcon-root': {
                transform: 'scale(1.1)',
                '& svg': {
                  color: '#fff'
                }
              },
              '& .MuiTypography-root': {
                color: '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }
            },
            transition: 'all 0.3s ease',
            borderRadius: 1,
            mx: 1,
            my: 0.25,
            minHeight: '36px',
            bgcolor: 'transparent',
            '& .MuiListItemIcon-root': {
              transition: 'transform 0.2s ease',
              minWidth: '36px'
            }
          }}
        >
          <ListItemIcon>
            <HomeIcon sx={{ color: '#fff', fontSize: '1.3rem' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Home" 
            primaryTypographyProps={{ 
              style: { 
                fontWeight: 'bold', 
                color: '#fff',
                fontSize: '1rem',
                letterSpacing: '0.3px'
              } 
            }} 
          />
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/EmployerJobManagement" 
          sx={{ 
            '&:hover': { 
              background: 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)',
              transform: 'translateX(4px)',
              boxShadow: '0 2px 4px rgba(156, 39, 176, .3)',
              '& .MuiListItemIcon-root': {
                transform: 'scale(1.1)',
                '& svg': {
                  color: '#fff'
                }
              },
              '& .MuiTypography-root': {
                color: '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }
            },
            transition: 'all 0.3s ease',
            borderRadius: 1,
            mx: 1,
            my: 0.25,
            minHeight: '36px',
            bgcolor: 'transparent',
            '& .MuiListItemIcon-root': {
              transition: 'transform 0.2s ease',
              minWidth: '36px'
            }
          }}
        >
          <ListItemIcon>
            <BusinessIcon sx={{ color: '#fff', fontSize: '1.3rem' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Jobs" 
            primaryTypographyProps={{ 
              style: { 
                fontWeight: 'bold', 
                color: '#fff',
                fontSize: '1rem',
                letterSpacing: '0.3px'
              } 
            }} 
          />
        </ListItem>
        <ListItem 
          button 
          component={Link} 
          to="/EmployerCompanyManagement" 
          sx={{ 
            '&:hover': { 
              background: 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)',
              transform: 'translateX(4px)',
              boxShadow: '0 2px 4px rgba(156, 39, 176, .3)',
              '& .MuiListItemIcon-root': {
                transform: 'scale(1.1)',
                '& svg': {
                  color: '#fff'
                }
              },
              '& .MuiTypography-root': {
                color: '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }
            },
            transition: 'all 0.3s ease',
            borderRadius: 1,
            mx: 1,
            my: 0.25,
            minHeight: '36px',
            bgcolor: 'transparent',
            '& .MuiListItemIcon-root': {
              transition: 'transform 0.2s ease',
              minWidth: '36px'
            }
          }}
        >
          <ListItemIcon>
            <PeopleIcon sx={{ color: '#fff', fontSize: '1.3rem' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Company" 
            primaryTypographyProps={{ 
              style: { 
                fontWeight: 'bold', 
                color: '#fff',
                fontSize: '1rem',
                letterSpacing: '0.3px'
              } 
            }} 
          />
        </ListItem>
      </List>
      <ListItem 
        button 
        onClick={handleLogout} 
        sx={{ 
          '&:hover': { 
            background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
            transform: 'translateX(4px)',
            boxShadow: '0 2px 4px rgba(211, 47, 47, 0.3)',
            '& .MuiListItemIcon-root': {
              transform: 'scale(1.1)',
              '& svg': {
                color: '#fff'
              }
            },
            '& .MuiTypography-root': {
              color: '#fff',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }
          },
          transition: 'all 0.3s ease',
          borderRadius: 1,
          mx: 1,
          my: 0.25,
          minHeight: '36px',
          bgcolor: 'transparent',
          '& .MuiListItemIcon-root': {
            transition: 'transform 0.2s ease',
            minWidth: '36px'
          }
        }}
      >
        <ListItemIcon>
          <ExitToAppIcon sx={{ color: '#fff', fontSize: '1.3rem' }} />
        </ListItemIcon>
        <ListItemText 
          primary="Logout" 
          primaryTypographyProps={{ 
            style: { 
              fontWeight: 'bold', 
              color: '#fff',
              fontSize: '1rem',
              letterSpacing: '0.3px'
            } 
          }} 
        />
      </ListItem>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', width: drawerWidth }}>
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
                keepMounted: true,
              }}
              sx={{
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                  backgroundColor: '#4a148c',
                  color: '#fff',
                  boxShadow: '4px 0 8px rgba(0,0,0,0.15)',
                  overflowX: 'hidden',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#4a148c',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#9c27b0',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#673ab7',
                  }
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
                backgroundColor: '#4a148c',
                color: '#fff',
                boxShadow: '4px 0 8px rgba(0,0,0,0.15)',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#4a148c',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#9c27b0',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#673ab7',
                }
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default EmployerNavbar;
