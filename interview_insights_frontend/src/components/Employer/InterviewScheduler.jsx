import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { scheduleInterview, fetchInterviews, updateInterview } from '../../features/interview/interviewSlice';
import { fetchJobs } from '../../features/jobs/jobsSlice';
import { fetchApplicants } from '../../features/applicants/applicantsSlice';
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
  CssBaseline,
  Alert,
} from '@mui/material';
import EmployerNavbar from '../EmployerNavbar';

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
  const [hours, minutes] = duration.split(':').map(Number);
  return (hours || 0) * 3600000 + (minutes || 0) * 60000; // Duration in milliseconds
};

const InterviewScheduler = () => {
  const { applicantId } = useParams();
  const dispatch = useDispatch();
  const { interviews } = useSelector((state) => state.interviews) || { interviews: [] };
  const jobs = useSelector((state) => state.jobs.jobs);
  const [applicants, setApplicants] = useState([]);
  const navigate = useNavigate();
  const [applicantsFetched, setApplicantsFetched] = useState(false);
  const [interviewData, setInterviewData] = useState({
    job_application: applicantId,
    scheduled_time: new Date(),
    duration: '00:00:00', // Default duration
    location: '',
    notes: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [conflictError, setConflictError] = useState('');

  useEffect(() => {
    dispatch(fetchInterviews());
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    if (jobs.length > 0 && !applicantsFetched) {
      jobs.forEach((job) => {
        dispatch(fetchApplicants(job.id)).then((response) => {
          if (response.payload) {
            setApplicants((prev) => [...prev, ...response.payload]); // Append applicants
          }
        });
      });
      setApplicantsFetched(true);
    }
  }, [dispatch, jobs, applicantsFetched]);

  const existingInterview = interviews.find(interview => interview.job_application == applicantId);

  useEffect(() => {
    if (existingInterview) {
      const durationInMilliseconds = parseDuration(existingInterview.duration);
      const totalMinutes = durationInMilliseconds / 60000;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      setInterviewData({
        job_application: applicantId,
        scheduled_time: new Date(existingInterview.scheduled_time),
        duration: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
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

  const handleFeedbackClick = () => {
    navigate(`/interview-feedback/${existingInterview.id}`);
  };

  const isTimeConflict = (existingInterviews, newInterview, interviewToExcludeId) => {
    return existingInterviews.some(interview => {
      if (interview.id === interviewToExcludeId) return false;

      const existingStart = new Date(interview.scheduled_time);
      const existingDurationInMilliseconds = parseDuration(interview.duration);
      const existingEnd = new Date(existingStart.getTime() + existingDurationInMilliseconds);

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
    const interviewToExcludeId = existingInterview ? existingInterview.id : null;

    if (isTimeConflict(interviews, interviewData, interviewToExcludeId)) {
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
        setInterviewData({
          job_application: applicantId,
          scheduled_time: new Date(),
          duration: '00:00:00',
          location: '',
          notes: '',
        });
      }
    }
  };

  // Map over interviews to include the job seeker name in the events
  const events = interviews.map(interview => {
    const durationInMilliseconds = parseDuration(interview.duration);
    const start = new Date(interview.scheduled_time);
    const end = new Date(start.getTime() + durationInMilliseconds);

    // Find the job seeker related to this interview
    const applicant = applicants.find(applicant => applicant.id == interview.job_application);
    const jobSeekerName = applicant ? applicant.job_seeker.user.full_name : "Unknown";

    return {
      title: `Interview with ${jobSeekerName}`, // Include job seeker name
      start,
      end,
    };
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <EmployerNavbar />
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
                      label="Duration (HH:mm)"
                      type="text"
                      id="duration"
                      name="duration"
                      value={interviewData.duration}
                      onChange={handleChange}
                      variant="outlined"
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
                  <Grid item xs={12} mt={2}>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={handleFeedbackClick}
                    >
                      Provide Feedback
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
    </Box>
  );
};

export default InterviewScheduler;