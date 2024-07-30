import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createChatRoom } from '../features/chat/chatSlice'; // Assume you have a createChatRoom thunk

const NewChatForm = () => {
  const dispatch = useDispatch();
  const [jobseekerId, setJobseekerId] = useState('');
  const [employerId, setEmployerId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (jobseekerId && employerId) {
      dispatch(createChatRoom({ jobseekerId, employerId }));
      setJobseekerId('');
      setEmployerId('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={jobseekerId}
        onChange={(e) => setJobseekerId(e.target.value)}
        placeholder="Jobseeker ID"
      />
      <input
        type="text"
        value={employerId}
        onChange={(e) => setEmployerId(e.target.value)}
        placeholder="Employer ID"
      />
      <button type="submit">Start New Chat</button>
    </form>
  );
};

export default NewChatForm;
