import React from 'react';
import ChatList from './ChatList';
import ChatRoom from './ChatRoom';

const Chat = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '30%' }}>
        <ChatList />
      </div>
      <div style={{ width: '70%' }}>
        <ChatRoom />
      </div>
    </div>
  );
};

export default Chat;