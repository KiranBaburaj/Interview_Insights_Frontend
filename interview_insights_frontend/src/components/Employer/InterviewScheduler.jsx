import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { scheduleInterview, fetchInterviews, updateInterview } from '../../features/interview/interviewSlice';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const parseDuration = (duration) => {
  // Expected format: HH:mm:ss
  const parts = duration.split(':').map(part => parseInt(part, 10));
  const hours = parts[0] || 0;
  const minutes = parts[1] || 0;
  const seconds = parts[2] || 0;

  return (hours * 3600 + minutes * 60 + seconds) * 1000; // Convert to milliseconds
};

const InterviewScheduler = () => {
  const { applicantId } = useParams();
  const dispatch = useDispatch();
  const { interviews, status, error } = useSelector((state) => state.interviews) || { interviews: [], status: 'idle', error: null };

  const [interviewData, setInterviewData] = useState({
    job_application: applicantId,
    scheduled_time: new Date(),
    duration: '00:00:00', // Default duration format
    location: '',
    notes: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [conflictError, setConflictError] = useState('');

  useEffect(() => {
    dispatch(fetchInterviews());
  }, [dispatch]);

  const existingInterview = interviews.find(interview => interview.job_application == applicantId);

  useEffect(() => {
    if (existingInterview) {
      setInterviewData({
        job_application: applicantId,
        scheduled_time: new Date(existingInterview.scheduled_time),
        duration: existingInterview.duration, // Keep duration as is
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
      const durationInMilliseconds = parseDuration(interview.duration);
      const existingEnd = new Date(existingStart.getTime() + durationInMilliseconds);

      const newStart = new Date(newInterview.scheduled_time);
      const newDurationInMilliseconds = parseDuration(newInterview.duration);
      const newEnd = new Date(newStart.getTime() + newDurationInMilliseconds);

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
          duration: '00:00:00', // Reset to default
          location: '',
          notes: '',
        });
      }
    }
  };

  const events = interviews.map(interview => {
    const durationInMilliseconds = parseDuration(interview.duration);

    const start = new Date(interview.scheduled_time);
    const end = new Date(start.getTime() + durationInMilliseconds);

    return {
      title: `Interview with ${interview.job_application}`,
      start,
      end,
    };
  });

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3, mt: 5 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Schedule Interview
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Interview Date and Time:</Typography>
                  <DatePicker
                    selected={interviewData.scheduled_time}
                    onChange={handleDateChange}
                    showTimeSelect
                    dateFormat="Pp"
                    customInput={<TextField fullWidth />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Duration"
                    type="text"
                    id="duration"
                    name="duration"
                    value={interviewData.duration}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="HH:mm:ss"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    type="text"
                    id="location"
                    name="location"
                    value={interviewData.location}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes"
                    type="text"
                    id="notes"
                    name="notes"
                    value={interviewData.notes}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Schedule Interview
                  </Button>
                </Grid>
              </Grid>
            </form>
            {conflictError && (
              <Snackbar open={true} autoHideDuration={6000}>
                <Alert severity="error">{conflictError}</Alert>
              </Snackbar>
            )}
            {successMessage && (
              <Snackbar open={true} autoHideDuration={6000}>
                <Alert severity="success">{successMessage}</Alert>
              </Snackbar>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 3, mt: 5 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Existing Interviews
            </Typography>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default InterviewScheduler;
