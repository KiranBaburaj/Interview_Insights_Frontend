import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { markNotificationAsRead, fetchNotifications } from '../features/notifications/notificationSlice';
import { connectNotificationWebSocket, closeNotificationWebSocket } from '../utils/notificationWebSocket';

const NotificationList = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  const [open, setOpen] = React.useState(false);
  const [currentNotification, setCurrentNotification] = React.useState(null);
  const token = useSelector(state => state.auth.accessToken);
  useEffect(() => {
    // Fetch initial notifications
    
    dispatch(fetchNotifications(token));

    // Connect WebSocket
    connectNotificationWebSocket(token, dispatch);

    // Cleanup WebSocket on component unmount
    return () => {
      closeNotificationWebSocket();
    };
  }, [dispatch]);

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
