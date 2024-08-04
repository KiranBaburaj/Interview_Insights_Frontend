import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { scheduleInterview, fetchInterviews, updateInterview } from '../../features/interview/interviewSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const InterviewScheduler = () => {
  const { applicantId } = useParams();
  console.log(applicantId)
  const dispatch = useDispatch();
  const { interviews, status, error } = useSelector((state) => state.interviews) || { interviews: [], status: 'idle', error: null };
  console.log(interviews)
  const [interviewData, setInterviewData] = useState({
    job_application: applicantId,
    scheduled_time: new Date(),
    duration: 60, // in minutes
    location: '',
    notes: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [conflictError, setConflictError] = useState('');

  useEffect(() => {
    dispatch(fetchInterviews());
  }, [dispatch]);

  const existingInterview = interviews.find(interview => interview.job_application == applicantId);
  console.log(existingInterview)

  useEffect(() => {
    if (existingInterview) {
      setInterviewData({
        job_application: applicantId,
        scheduled_time: new Date(existingInterview.scheduled_time),
        duration: existingInterview.duration,
        location: existingInterview.location,
        notes: existingInterview.notes,
      });
    }
  }, [existingInterview, applicantId]);

  const handleChange = (e) => {
    setInterviewData({ ...interviewData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setInterviewData({ ...interviewData, scheduled_time: date });
  };

  const isTimeConflict = (existingInterviews, newInterview) => {
    return existingInterviews.some(interview => {
      const existingStart = new Date(interview.scheduled_time);
      const existingEnd = new Date(existingStart.getTime() + interview.duration * 60000);
      const newStart = new Date(newInterview.scheduled_time);
      const newEnd = new Date(newStart.getTime() + newInterview.duration * 60000);

      return (newStart < existingEnd && newEnd > existingStart);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConflictError('');
    setSuccessMessage('');

    // Check for time conflicts
    if (isTimeConflict(interviews, interviewData)) {
      setConflictError('This time slot conflicts with an existing interview.');
      return;
    }

    if (existingInterview) {
      const resultAction = await dispatch(updateInterview({ id: existingInterview.id, interviewData }));
      if (updateInterview.fulfilled.match(resultAction)) {
        setSuccessMessage('Interview updated successfully!');
      }
    } else {
      const resultAction = await dispatch(scheduleInterview(interviewData));
      if (scheduleInterview.fulfilled.match(resultAction)) {
        setSuccessMessage('Interview scheduled successfully!');
        // Reset form
        setInterviewData({
          job_application: applicantId,
          scheduled_time: new Date(),
          duration: 60,
          location: '',
          notes: '',
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="scheduled_time">Interview Date and Time:</label>
        <DatePicker
          id="scheduled_time"
          selected={interviewData.scheduled_time}
          onChange={handleDateChange}
          showTimeSelect
          dateFormat="Pp"
        />
      </div>
      <div>
        <label htmlFor="duration">Duration (minutes):</label>
        <input
          type="number"
          id="duration"
          name="duration"
          value={interviewData.duration}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={interviewData.location}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="notes">Notes:</label>
        <textarea
          id="notes"
          name="notes"
          value={interviewData.notes}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Schedule Interview</button>
      {conflictError && <p style={{ color: 'red' }}>{conflictError}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </form>
  );
};

export default InterviewScheduler;
