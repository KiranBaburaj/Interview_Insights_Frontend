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
import WorkIcon from '@mui/icons-material/Work';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearError,logout } from '../features/auth/authSlice';
import NotificationList from './NotificationList';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const JobseekerNavbar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { full_name } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearError());
    navigate('/login');
  };

  const avatarImageUrl = '/logo.PNG'; // Path to avatar image

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
        background: 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)',
        boxShadow: '0 2px 4px rgba(156, 39, 176, .3)',
        mx: 1.5,
        borderRadius: 1,
        mb: 0.5,
        maxWidth: '100%'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Avatar src={avatarImageUrl} sx={{ 
            width: 40, 
            height: 40, 
            mr: 1,
            border: '2px solid #9c27b0',
            boxShadow: '0 0 4px rgba(156, 39, 176, 0.5)'
          }} />
          <Typography variant="h6" noWrap sx={{ 
            fontWeight: 'bold', 
            color: '#fff',
            letterSpacing: '0.5px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            fontSize: '1.1rem'
          }}>
            Interview Insights
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
          to="/dashboard/jobseeker" 
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
          to="/jobseekerapplications" 
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
            <WorkIcon sx={{ color: '#fff', fontSize: '1.3rem' }} />
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
          to="/jobseekerprofile" 
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
            <AccountBoxIcon sx={{ color: '#fff', fontSize: '1.3rem' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Profile" 
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
  );
};

export default JobseekerNavbar;