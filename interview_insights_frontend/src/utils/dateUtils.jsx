// src/utils/dateUtils.js
export const isTimeConflict = (existingInterviews, newInterview) => {
    return existingInterviews.some(interview => {
      const existingStart = new Date(interview.scheduled_time);
      const existingEnd = new Date(existingStart.getTime() + interview.duration * 60000);
      const newStart = new Date(newInterview.scheduled_time);
      const newEnd = new Date(newStart.getTime() + newInterview.duration * 60000);
  
      return (newStart < existingEnd && newEnd > existingStart);
    });
  };