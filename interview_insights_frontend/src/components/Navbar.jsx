import React from 'react';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const userMenuOpen = Boolean(userMenuAnchorEl);

  // Mock logged in state and user info (replace with actual auth logic)
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState(null);

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



  const handleLogout = () => {
    // Implement actual logout logic here
    setIsLoggedIn(false);
    setUser(null);
    handleUserMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Job Portal
        </Typography>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Jobs</Button>
          <Button color="inherit">Companies</Button>
          <Button color="inherit">About</Button>
          <Button color="inherit">Contact</Button>
          {isLoggedIn ? (
            <>
              <Button color="inherit" onClick={handleUserMenu}>
                {user.name}
              </Button>
              <Menu
                anchorEl={userMenuAnchorEl}
                open={userMenuOpen}
                onClose={handleUserMenuClose}
              >
                <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>login</Button>
          )}
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
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
            {isLoggedIn ? (
              <MenuItem onClick={handleLogout}>Logout ({user.name})</MenuItem>
            ) : (
                <Button color="inherit" onClick={() => navigate('/login')}>login</Button>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;