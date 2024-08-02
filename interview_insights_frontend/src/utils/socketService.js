// utils/socketService.js

import io from 'socket.io-client';

let socket = null;

export const connectSocket = (roomName, token, onMessageReceived) => {
  if (socket) {
    console.warn('Socket.IO already connected.');
    return socket;
  }

  socket = io('http://localhost:8000', {
    transports: ['websocket'], // Ensure WebSocket is used
    query: { roomName },
    auth: { token }, // Pass the token if needed for authentication
  });

  socket.on('connect', () => {
    console.log('Socket.IO connection established.');
  });

  socket.on('chat_message', (data) => {
    console.log('Message received:', data);
    onMessageReceived(data);
  });

  socket.on('disconnect', () => {
    console.log('Socket.IO connection closed.');
  });

  return socket;
};

export const sendSocketMessage = (messagePayload) => {
  if (socket && socket.connected) {
    socket.emit('chat_message', messagePayload);
  } else {
    console.warn('Socket.IO is not connected. Message not sent.');
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null; // Clear the socket reference
  }
};
