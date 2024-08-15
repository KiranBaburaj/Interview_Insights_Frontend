import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFeedback, submitFeedback, updateFeedback } from '../../features/interview/interviewSlice';
import { Box, Button, Container, Grid, Paper, TextField, Typography, Snackbar, CssBaseline, Alert, MenuItem } from '@mui/material';
import EmployerNavbar from '../EmployerNavbar';

const InterviewFeedbackForm = () => {
  const { interviewId } = useParams();
  const parsedInterviewId = parseInt(interviewId, 10);
  const FDB = useSelector((state) => state.interviews);
  console.log(FDB);
  const job = useSelector((state) => state.applicants.job_Id);
  console.log(job);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use the useNavigate hook
  const { currentFeedback, status, error } = useSelector((state) => state.interviews);

  const [feedbackData, setFeedbackData] = useState({
    score: 0,
    feedback: '',
    stage: '',
    interview_schedule: parsedInterviewId || '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (parsedInterviewId) {
      console.log("Fetching feedback for interviewId:", parsedInterviewId);
      dispatch(fetchFeedback(parsedInterviewId))
        .then(() => {
          console.log("Feedback fetched successfully");
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching feedback:", error);
          setIsLoading(false);
        });
    }
  }, [dispatch, parsedInterviewId]);

  useEffect(() => {
    console.log("Current feedback:", currentFeedback);
    console.log("Interview ID:", parsedInterviewId);
    if (currentFeedback && currentFeedback.interview_schedule === parsedInterviewId) {
      console.log("Setting feedback data");
      setFeedbackData({
        score: currentFeedback.score || 0,
        feedback: currentFeedback.feedback || '',
        stage: currentFeedback.stage || '',
        interview_schedule: currentFeedback.interview_schedule || parsedInterviewId,
      });
    }
  }, [currentFeedback, parsedInterviewId]);

  const handleChange = (e) => {
    setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMsg('');

    if (!feedbackData.interview_schedule) {
      setErrorMsg('Interview schedule is required.');
      return;
    }

    try {
      const resultAction = currentFeedback && currentFeedback.id
        ? await dispatch(updateFeedback({ id: currentFeedback.id, feedbackData }))
        : await dispatch(submitFeedback({ interviewId: feedbackData.interview_schedule, feedbackData }));

      if (resultAction.type.endsWith('/fulfilled')) {
        setSuccessMessage('Feedback submitted successfully!');
        // Navigate to the desired route after successful submission
       
        navigate(`/EmployerJobapplicants/${job}`);
      } else {
        setErrorMsg('An error occurred while submitting feedback.');
      }
    } catch (error) {
      setErrorMsg('An unexpected error occurred.');
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

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