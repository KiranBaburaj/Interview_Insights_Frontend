import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { markNotificationAsRead, fetchNotifications, addNotification } from '../features/notifications/notificationSlice';
import { connectNotificationWebSocket, closeNotificationWebSocket } from '../utils/notificationWebSocket';

const NotificationList = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  console.log(notifications);
  const token = useSelector(state => state.auth.accessToken);
  const userid = useSelector(state => state.auth.userid);

  useEffect(() => {
    // Fetch initial notifications
    dispatch(fetchNotifications(token));

    // Connect WebSocket
    const notificationSocket = connectNotificationWebSocket(token, userid, (notification) => {
      // Ensure notification has a nested payload
      if (notification.payload) {
        const { id, message, is_read, user_id, notification_type, timestamp } = notification.payload;
        dispatch(addNotification({
          id,
          message,
          is_read,
          user: user_id, // Adjust field names as necessary
          notification_type,
          created_at: timestamp || notification.payload.created_at, // Handle timestamp
        }));
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

  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

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
  };

  useEffect(() => {
    if (currentNotification) {
      setOpen(true);
    }
  }, [currentNotification]);

  return (
    <div>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={!notification.is_read}
          autoHideDuration={6000}
          onClose={handleClose}
          message={notification.message}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={() => handleNotificationClick(notification)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      ))}
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
