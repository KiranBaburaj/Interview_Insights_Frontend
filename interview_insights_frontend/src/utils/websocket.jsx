let socket = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5; // Limit the number of reconnection attempts

/**
 * Connect to WebSocket.
 * @param {string} roomId - The room ID to connect to.
 * @param {function} onMessageReceived - Callback function to handle incoming messages.
 * @param {string} token - JWT token for authentication.
 * @returns {WebSocket} - The WebSocket connection.
 */
export const connectWebSocket = (roomId, onMessageReceived, token) => {
  // Establish the WebSocket connection
  socket = new WebSocket(`ws://localhost:8000/ws/chat/${roomId}/?token=${token}`);

  // When the connection is established
  socket.onopen = () => {
    console.log('WebSocket connection established.');
    reconnectAttempts = 0; // Reset reconnect attempts on successful connection
  };

  // When a message is received from the server
  socket.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    if (data.error) {
      console.error('WebSocket error:', data.error);
    } else if (data.message) {
      // Add a timestamp and ensure sender information is included
      const messageWithDetails = {
        ...data.message,
        timestamp: data.message.timestamp || new Date().toISOString(),
        sender: data.message.sender || { id: data.message.user_id, name: 'User ' + data.message.user_id }
      };
      onMessageReceived(messageWithDetails);
    }
  } catch (e) {
    console.error('Failed to parse WebSocket message:', e);
  }
};

  // When an error occurs
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  // When the connection is closed
  socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
    if (reconnectAttempts < maxReconnectAttempts) {
      // Attempt to reconnect after a delay
      setTimeout(() => {
        reconnectAttempts++;
        connectWebSocket(roomId, onMessageReceived, token);
      }, 3000); // Reconnect after 3 seconds
    } else {
      console.error('Max reconnect attempts reached. Could not reconnect.');
    }
  };

  return socket;
};

/**
 * Send a message via WebSocket.
 * @param {Object} messagePayload - The message payload to send.
 */
export const sendWebSocketMessage = (messagePayload) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(messagePayload));
  } else {
    console.warn('WebSocket is not open. Message not sent.');
  }
};

/**
 * Close the WebSocket connection.
 */
export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null; // Clear the socket reference
  }
};
