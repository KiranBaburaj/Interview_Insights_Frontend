import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchFeedback, submitFeedback, updateFeedback } from '../../features/interview/interviewSlice';
import { Box, Button, Container, Grid, Paper, TextField, Typography, Snackbar, CssBaseline, Alert, MenuItem } from '@mui/material';
import EmployerNavbar from '../EmployerNavbar';

const InterviewFeedbackForm = () => {
  const { interviewId } = useParams();
  const dispatch = useDispatch();
  const { feedback, status, error } = useSelector((state) => state.interviews) || { feedback: {}, status: 'idle', error: null };

  const [feedbackData, setFeedbackData] = useState({
    score: 0,
    feedback: '',
    stage: '',
    interview_schedule: interviewId || '', // Add interviewSchedule to the state
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (interviewId) {
      dispatch(fetchFeedback(interviewId)); // Fetch feedback for the specific interview
    }
  }, [dispatch, interviewId]);

  useEffect(() => {
    if (feedback) {
      setFeedbackData({
        score: feedback.score || 0,
        feedback: feedback.feedback || '',
        stage: feedback.stage || '',
        interview_schedule: int(feedback.interview_schedule) || int(interviewId)|| '', // Set interviewSchedule
      });
    }
  }, [feedback, interviewId]);

  const handleChange = (e) => {
    setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMsg('');
  
    // Ensure interviewSchedule is set
    if (!feedbackData.interview_schedule) {
      setErrorMsg('Interview schedule is required.');
      return;
    }

    // Check if feedback exists and has an id
    const resultAction = feedback && feedback.id
      ? await dispatch(updateFeedback({ id: feedback.id, feedbackData }))
      : await dispatch(submitFeedback({ feedbackData }));
  
    if (resultAction.type === 'interviews/submitFeedback/fulfilled' || resultAction.type === 'interviews/updateFeedback/fulfilled') {
      setSuccessMessage('Feedback submitted successfully!');
    } else {
      setErrorMsg('An error occurred while submitting feedback.');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <EmployerNavbar />
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ padding: 3, mt: 5 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Submit Interview Feedback
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Score (1-10)"
                      type="number"
                      id="score"
                      name="score"
                      value={feedbackData.score}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{ inputProps: { min: 0, max: 10 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Feedback"
                      type="text"
                      id="feedback"
                      name="feedback"
                      value={feedbackData.feedback}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Interview Stage"
                      id="stage"
                      name="stage"
                      select
                      value={feedbackData.stage}
                      onChange={handleChange}
                      variant="outlined"
                    >
                      {[
                        'application_screening',
                        'phone_interview',
                        'technical_assessment',
                        'first_round_interview',
                        'second_round_interview',
                        'hr_interview',
                        'final_interview',
                        'job_offer',
                        'hired'
                      ].map((stage) => (
                        <MenuItem key={stage} value={stage}>
                          {stage.replace(/_/g, ' ').toUpperCase()}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <input type="hidden" name="interviewSchedule" value={feedbackData.interview_schedule} />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Submit Feedback
                    </Button>
                  </Grid>
                </Grid>
              </form>
              {errorMsg && (
                <Snackbar open={true} autoHideDuration={6000}>
                  <Alert severity="error">{errorMsg}</Alert>
                </Snackbar>
              )}
              {successMessage && (
                <Snackbar open={true} autoHideDuration={6000}>
                  <Alert severity="success">{successMessage}</Alert>
                </Snackbar>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InterviewFeedbackForm;
