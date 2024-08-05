// features/notifications/notificationWebSocket.js
import { addNotification } from '../features/notifications/notificationSlice';

let notificationSocket = null;

/**
 * Connect to WebSocket for notifications.
 * @param {string} token - JWT token for authentication.
 * @param {function} dispatch - Redux dispatch function.
 */
export const connectNotificationWebSocket = (token, dispatch) => {
  if (notificationSocket) {
    console.warn('Notification WebSocket already connected.');
    return;
  }

  notificationSocket = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${token}`);

  notificationSocket.onopen = () => {
    console.log('Notification WebSocket connection established.');
  };

  notificationSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.notification) {
        dispatch(addNotification(data.notification));
      }
    } catch (e) {
      console.error('Failed to parse notification WebSocket message:', e);
    }
  };

  notificationSocket.onerror = (error) => {
    console.error('Notification WebSocket error:', error);
  };

  notificationSocket.onclose = (event) => {
    console.log('Notification WebSocket connection closed:', event);
    // Handle reconnection logic if needed
  };
};

export const closeNotificationWebSocket = () => {
  if (notificationSocket) {
    notificationSocket.close();
    notificationSocket = null;
    console.log('Notification WebSocket connection closed.');
  }
};
