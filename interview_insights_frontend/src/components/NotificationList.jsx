import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, IconButton, Badge, Menu, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { markNotificationAsRead, fetchNotifications, addNotification } from '../features/notifications/notificationSlice';
import { connectNotificationWebSocket, closeNotificationWebSocket } from '../utils/notificationWebSocket';

const NotificationList = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  
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
        // Update unread count
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
    // Update unread count to reflect notification read status
    setUnreadCount(prevCount => prevCount - 1);
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
      >
        {recentNotifications.length > 0 ? (
          recentNotifications.map((notification) => (
            <MenuItem key={notification.id} onClick={() => handleNotificationClick(notification)}>
              {notification.message}
            </MenuItem>
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
