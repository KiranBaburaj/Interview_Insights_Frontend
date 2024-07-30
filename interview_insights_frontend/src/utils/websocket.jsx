let socket = null;

export const connectWebSocket = (roomId, onMessageReceived) => {
  socket = new WebSocket(`ws://localhost:8000/ws/chat/${roomId}/`);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    onMessageReceived(data.message);
  };

  return socket;
};

export const sendWebSocketMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ message }));
  }
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
  }
};