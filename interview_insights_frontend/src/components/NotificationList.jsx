import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, IconButton, Badge, Menu, MenuItem, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { markNotificationAsRead, fetchNotifications, addNotification } from '../features/notifications/notificationSlice';
import { connectNotificationWebSocket, closeNotificationWebSocket } from '../utils/notificationWebSocket';
import { styled } from '@mui/material/styles';

// Styled MenuItem for unread notifications
const StyledMenuItem = styled(MenuItem)(({ theme, unread }) => ({
  backgroundColor: unread ? theme.palette.action.hover : theme.palette.background.paper,
  color: unread ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: unread ? 'bold' : 'normal',
  '&:hover': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const NotificationList = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const role = useSelector(state => state.auth.role);
  const token = useSelector(state => state.auth.accessToken);
  const userid = useSelector(state => state.auth.userid);

  useEffect(() => {
    // Fetch initial notifications
    dispatch(fetchNotifications(token));

    // Connect WebSocket
    const notificationSocket = connectNotificationWebSocket(token, userid, (notification) => {
      if (notification.payload) {
        const { id, message, is_read, user_id, notification_type, timestamp } = notification.payload;
        dispatch(addNotification({
          id,
          message,
          is_read,
          user: user_id,
          notification_type,
          created_at: timestamp || notification.payload.created_at,
        }));
        // Update unread count if not read
        if (!is_read) {
          setUnreadCount(prevCount => prevCount + 1);
        }
        console.log('Notification received:', notification.payload);
      } else {
        console.warn('Unexpected notification format:', notification);
      }
    });

    // Cleanup WebSocket on component unmount
    return () => {
      closeNotificationWebSocket();
    };
  }, [dispatch, token, userid]);

  useEffect(() => {
    // Calculate unread notifications count
    const count = notifications.filter(notification => !notification.is_read).length;
    setUnreadCount(count);
  }, [notifications]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleNotificationClick = (notification) => {
    dispatch(markNotificationAsRead(notification.id));
    setCurrentNotification(notification);
    setOpen(true);
    if (role === 'jobseeker') {
      navigate('/chat')}
      else if (role === 'employer') {
        navigate('/Employer/chat');
    }

  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    // Reset unread count when menu is opened
    setUnreadCount(0);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Filter unread notifications
  const unreadNotifications = notifications.filter(notification => !notification.is_read);

  // Get the 20 most recent notifications (most recent first)
  const recentNotifications = [...notifications]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 20);

  return (
    <div>
      <IconButton
        size="large"
        aria-label="show notifications"
        color="inherit"
        onClick={handleMenuClick}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            backgroundColor: '#ffffff', // Background color for the menu
            color: '#333333', // Text color for better contrast
          },
        }}
      >
        {unreadNotifications.length > 0 ? (
          unreadNotifications.map((notification) => (
            <StyledMenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              unread={!notification.is_read}  // Apply conditional styling based on read status
            >
              <Typography variant="body2" noWrap>
                {notification.message}
              </Typography>
            </StyledMenuItem>
          ))
        ) : (
          <MenuItem disabled>No new notifications</MenuItem>
        )}
      </Menu>

      {currentNotification && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={currentNotification.message}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      )}
    </div>
  );
};

export default NotificationList;