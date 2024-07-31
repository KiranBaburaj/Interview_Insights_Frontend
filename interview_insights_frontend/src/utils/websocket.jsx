let socket = null;

export const connectWebSocket = (roomId, onMessageReceived, token) => {
  socket = new WebSocket(`ws://localhost:8000/ws/chat/${roomId}/`);

  socket.onopen = () => {
    console.log('WebSocket connection established.');
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.error) {
      console.error('WebSocket error:', data.error);
    } else if (data.message) {
      onMessageReceived(data.message);
    }
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = (event) => {
    console.log('WebSocket connection closed:', event);
  };

  return socket;
};

export const sendWebSocketMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'chat_message', message }));
  } else {
    console.warn('WebSocket is not open. Message not sent.');
  }
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null; // Clear the socket reference
  }
};