import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, IconButton, Badge, Menu, MenuItem, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { markNotificationAsRead, fetchNotifications, addNotification } from '../features/notifications/notificationSlice';
import { connectNotificationWebSocket, closeNotificationWebSocket } from '../utils/notificationWebSocket';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications.notifications);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  const token = useSelector(state => state.auth.accessToken);
  const userid = useSelector(state => state.auth.userid);
  const role = useSelector(state => state.auth.role);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    dispatch(fetchNotifications(token));

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
        if (!is_read) {
          setUnreadCount(prevCount => prevCount + 1);
        }
      }
    });

    return () => {
      closeNotificationWebSocket();
    };
  }, [dispatch, token, userid]);

  useEffect(() => {
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

    // Navigate to chat if the notification is chat-related
    if (role === 'jobseeker') {
      navigate('/chat')}
      else if (role === 'employer') {
        navigate('/Employer/chat');
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setUnreadCount(0);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const unreadNotifications = notifications.filter(notification => !notification.is_read);
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
            backgroundColor: '#ffffff',
            color: '#333333',
          },
        }}
      >
        {unreadNotifications.length > 0 ? (
          unreadNotifications.map((notification) => (
            <StyledMenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              unread={!notification.is_read}
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