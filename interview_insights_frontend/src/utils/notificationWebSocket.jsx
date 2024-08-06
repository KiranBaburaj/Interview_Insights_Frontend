import { addNotification } from '../features/notifications/notificationSlice';

let notificationSocket = null;

/**
 * Connect to WebSocket for notifications.
 * @param {string} token - JWT token for authentication.
 * @param {number} userId - The user ID for the notifications.
 * @param {function} dispatch - Redux dispatch function.
 * @returns {WebSocket} - The WebSocket instance.
 */
export const connectNotificationWebSocket = (token, userId, dispatch) => {
  if (notificationSocket) {
    console.warn('Notification WebSocket already connected.');
    return notificationSocket;
  }

  notificationSocket = new WebSocket(`ws://localhost:8000/ws/notifications/${userId}/?token=${token}`);

  notificationSocket.onopen = () => {
    console.log('Notification WebSocket connection established.');
  };

  notificationSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('WebSocket message:', data);

      if (data.notification) {
        dispatch(addNotification(data.notification));
        console.log('WebSocket message:', data);
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

  return notificationSocket;  // Return the WebSocket instance
};

/**
 * Send a notification through WebSocket.
 * @param {Object} notificationPayload - The notification data to be sent.
 */
export const sendNotificationWebSocketMessage = (notificationPayload) => {
  if (notificationSocket) {
    notificationSocket.send(JSON.stringify(notificationPayload));
    console.log("Sent notification:", notificationPayload);
  } else {
    console.warn('Notification WebSocket is not connected.');
  }
};

/**
 * Close the WebSocket connection.
 */
export const closeNotificationWebSocket = () => {
  if (notificationSocket) {
    notificationSocket.close();
    notificationSocket = null;
    console.log('Notification WebSocket connection closed.');
  }
};
