import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatRooms, setCurrentChatRoom } from '../features/chat/chatSlice';
import NewChatForm from './NewChatForm';

const ChatList = () => {
  const dispatch = useDispatch();
  const chatRooms = useSelector(state => state.chat.chatRooms);
  const status = useSelector(state => state.chat.status);

  useEffect(() => {
    dispatch(fetchChatRooms());
  }, [dispatch]);

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error loading chat rooms</div>;

  return (
    <div>
      <NewChatForm/>
      <h2>Chat Rooms</h2>
      {chatRooms.map(room => (
        <div key={room.id} onClick={() => dispatch(setCurrentChatRoom(room))}>
          {room.jobseeker.username} - {room.employer.username}
          {room.last_message && (
            <p>Last message: {room.last_message.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatList;