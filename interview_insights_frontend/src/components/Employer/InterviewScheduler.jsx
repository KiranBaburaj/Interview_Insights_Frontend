import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { scheduleInterview } from '../../features/interview/interviewSlice';

const InterviewScheduler = () => {
  const { applicantId } = useParams(); // Get applicantId from route
  const dispatch = useDispatch();
  const [interviewData, setInterviewData] = useState({
    job_application: applicantId,
    scheduled_time: '',
    duration: '01:00:00',
    location: '',
    notes: '',
  });

  const handleChange = (e) => {
    setInterviewData({ ...interviewData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(scheduleInterview(interviewData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="datetime-local"
        name="scheduled_time"
        value={interviewData.scheduled_time}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="location"
        value={interviewData.location}
        onChange={handleChange}
        placeholder="Interview Location"
      />
      <textarea
        name="notes"
        value={interviewData.notes}
        onChange={handleChange}
        placeholder="Interview Notes"
      />
      <button type="submit">Schedule Interview</button>
    </form>
  );
};

export default InterviewScheduler;
