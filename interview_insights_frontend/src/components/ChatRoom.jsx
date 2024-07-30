import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage, addMessage } from '../features/chat/chatSlice';
import { connectWebSocket, sendWebSocketMessage, closeWebSocket } from '../utils/websocket';

const ChatRoom = () => {
  const dispatch = useDispatch();
  const currentChatRoom = useSelector(state => state.chat.currentChatRoom);
  const messages = useSelector(state => state.chat.messages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentChatRoom) {
      dispatch(fetchMessages(currentChatRoom.id));
      const socket = connectWebSocket(currentChatRoom.id, (message) => {
        dispatch(addMessage(message));
      });

      return () => {
        closeWebSocket();
      };
    }
  }, [dispatch, currentChatRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      dispatch(sendMessage({ chatRoomId: currentChatRoom.id, content: newMessage }));
      sendWebSocketMessage(newMessage);
      setNewMessage('');
    }
  };

  if (!currentChatRoom) return <div>Select a chat room</div>;

  return (
    <div>
      <h2>Chat with {currentChatRoom.jobseeker.username} - {currentChatRoom.employer.username}</h2>
      <div style={{ height: '400px', overflowY: 'scroll' }}>
        {messages.map(message => (
          <div key={message.id}>
            <strong>{message.sender.username}:</strong> {message.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatRoom;