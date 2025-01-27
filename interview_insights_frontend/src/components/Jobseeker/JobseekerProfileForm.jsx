import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField, Button, Container, Grid, Typography, Paper, Avatar, Card, CardContent, CardMedia,
  Select, MenuItem, FormControl, InputLabel, IconButton, Chip, Divider, Box, Alert, Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { fetchProfile, updateProfile } from '../../features/jobseeker/jobseekerSlice2';
import { fetchApplications } from '../../features/applications/applicationsSlice';
import { fetchInterviews, fetchFeedback, updateFeedback } from '../../features/interview/interviewSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { data: profile, status, error } = useSelector((state) => state.profile);
  const [formData, setFormData] = useState({});
  const [educations, setEducations] = useState([]);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resume, setResume] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfilePhotoChanged, setIsProfilePhotoChanged] = useState(false);
  const [isResumeChanged, setIsResumeChanged] = useState(false);
  const [profilePhotoURL, setProfilePhotoURL] = useState(null);
  const [resumeURL, setResumeURL] = useState(null);
  const [applications, setApplications] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const applicationData = useSelector((state) => state.myapplications.applications);
  const interviews = useSelector((state) => state.interviews.interviews);
  const currentFeedback = useSelector((state) => state.interviews.currentFeedback);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchApplications());
    dispatch(fetchInterviews());
    dispatch(fetchFeedback());
  }, [dispatch]);

  useEffect(() => {
    if (interviews.length > 0) {
      interviews.forEach(interview => {
        dispatch(fetchFeedback(interview.id));
      });
    }
  }, [dispatch, interviews]);

  useEffect(() => {
    if (profile && !isEditing) {
      setFormData({
        full_name: profile.user?.full_name || '',
        phone_number: profile.phone_number || '',
        date_of_birth: profile.date_of_birth || '',
        bio: profile.bio || '',
        linkedin_url: profile.linkedin_url || '',
        portfolio_url: profile.portfolio_url || '',
        current_job_title: profile.current_job_title || '',
        job_preferences: profile.job_preferences || '',
      });
      setEducations(profile.educations?.map(edu => ({ ...edu })) || []);
      setWorkExperiences(profile.work_experience?.map(exp => ({ ...exp })) || []);
      setSkills(profile.skills?.map(skill => ({ ...skill })) || []);
      
      // Only update file states if they're not already set or if we're not in editing mode
      if (!isProfilePhotoChanged) {
        setProfilePhoto(profile.profile_photo);
      }
      if (!isResumeChanged) {
        setResume(profile.resume);
      }
    }
  }, [profile, isEditing, isProfilePhotoChanged, isResumeChanged]);

  useEffect(() => {
    if (applicationData) {
      setApplications(applicationData);
    }
  }, [applicationData]);

  useEffect(() => {
    if (profilePhoto) {
      if (typeof profilePhoto === 'string') {
        setProfilePhotoURL(profilePhoto);
      } else if (profilePhoto instanceof File) {
        setProfilePhotoURL(URL.createObjectURL(profilePhoto));
      }
    }
    return () => {
      if (profilePhotoURL) {
        URL.revokeObjectURL(profilePhotoURL);
      }
    };
  }, [profilePhoto]);

  useEffect(() => {
    if (resume) {
      if (typeof resume === 'string') {
        setResumeURL(resume);
      } else if (resume instanceof File) {
        setResumeURL(URL.createObjectURL(resume));
      }
    }
    return () => {
      if (resumeURL) {
        URL.revokeObjectURL(resumeURL);
      }
    };
  }, [resume]);

  const validateForm = () => {
    const errors = {};
    
    // Validate required fields
    if (!formData.full_name?.trim()) {
      errors.full_name = 'Full name is required';
    }
    if (!formData.phone_number?.trim()) {
      errors.phone_number = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone_number)) {
      errors.phone_number = 'Invalid phone number format';
    }
    
    // Validate LinkedIn URL format
    if (formData.linkedin_url && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(formData.linkedin_url)) {
      errors.linkedin_url = 'Invalid LinkedIn URL format';
    }
    
    // Validate Portfolio URL format
    if (formData.portfolio_url && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(formData.portfolio_url)) {
      errors.portfolio_url = 'Invalid Portfolio URL format';
    }

    // Validate file types and sizes
    if (profilePhoto instanceof File) {
      if (!profilePhoto.type.startsWith('image/')) {
        errors.profile_photo = 'Please upload an image file';
      } else if (profilePhoto.size > 5 * 1024 * 1024) { // 5MB limit
        errors.profile_photo = 'Profile photo must be less than 5MB';
      }
    }

    if (resume instanceof File) {
      if (resume.type !== 'application/pdf') {
        errors.resume = 'Please upload a PDF file';
      } else if (resume.size > 10 * 1024 * 1024) { // 10MB limit
        errors.resume = 'Resume must be less than 10MB';
      }
    }

    // Validate educations
    const educationErrors = [];
    educations.forEach((education, index) => {
      const eduError = {};
      
      if (!education.field_of_study?.trim()) {
        eduError.field_of_study = 'Field of study is required';
      }
      
      if (!education.institution?.trim()) {
        eduError.institution = 'Institution is required';
      }
      
      if (!education.location?.trim()) {
        eduError.location = 'Location is required';
      }
      
      // Validate date format and logic
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!education.start_date) {
        eduError.start_date = 'Start date is required';
      } else if (!dateRegex.test(education.start_date)) {
        eduError.start_date = 'Use format: YYYY-MM-DD';
      }
      
      if (!education.end_date) {
        eduError.end_date = 'End date is required';
      } else if (!dateRegex.test(education.end_date)) {
        eduError.end_date = 'Use format: YYYY-MM-DD';
      }
      
      // Validate start date is before end date
      if (education.start_date && education.end_date && 
          dateRegex.test(education.start_date) && dateRegex.test(education.end_date)) {
        if (new Date(education.start_date) > new Date(education.end_date)) {
          eduError.end_date = 'End date must be after start date';
        }
      }

      if (Object.keys(eduError).length > 0) {
        educationErrors[index] = eduError;
      }
    });

    if (educationErrors.length > 0) {
      errors.educations = educationErrors;
    }

    // Validate work experiences
    const workExperienceErrors = [];
    workExperiences.forEach((experience, index) => {
      const expError = {};
      
      if (!experience.job_title?.trim()) {
        expError.job_title = 'Job title is required';
      }
      
      if (!experience.company_name?.trim()) {
        expError.company_name = 'Company name is required';
      }
      
      if (!experience.company_location?.trim()) {
        expError.company_location = 'Company location is required';
      }
      
      // Validate date format and logic
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!experience.start_date) {
        expError.start_date = 'Start date is required';
      } else if (!dateRegex.test(experience.start_date)) {
        expError.start_date = 'Use format: YYYY-MM-DD';
      }
      
      if (!experience.end_date) {
        expError.end_date = 'End date is required';
      } else if (!dateRegex.test(experience.end_date)) {
        expError.end_date = 'Use format: YYYY-MM-DD';
      }
      
      // Validate start date is before end date
      if (experience.start_date && experience.end_date && 
          dateRegex.test(experience.start_date) && dateRegex.test(experience.end_date)) {
        if (new Date(experience.start_date) > new Date(experience.end_date)) {
          expError.end_date = 'End date must be after start date';
        }
      }

      if (!experience.technologies_used?.trim()) {
        expError.technologies_used = 'Technologies used is required';
      }

      if (Object.keys(expError).length > 0) {
        workExperienceErrors[index] = expError;
      }
    });

    if (workExperienceErrors.length > 0) {
      errors.workExperiences = workExperienceErrors;
    }

    // Validate skills
    const skillErrors = [];
    skills.forEach((skill, index) => {
      const skillError = {};
      
      if (!skill.skill_name?.trim()) {
        skillError.skill_name = 'Skill name is required';
      }
      
      if (!skill.proficiency_level) {
        skillError.proficiency_level = 'Proficiency level is required';
      }
      
      if (!skill.years_of_experience) {
        skillError.years_of_experience = 'Years of experience is required';
      } else if (isNaN(skill.years_of_experience) || Number(skill.years_of_experience) < 0) {
        skillError.years_of_experience = 'Must be a positive number';
      }
      
      if (!skill.skill_type) {
        skillError.skill_type = 'Skill type is required';
      }

      if (Object.keys(skillError).length > 0) {
        skillErrors[index] = skillError;
      }
    });

    if (skillErrors.length > 0) {
      errors.skills = skillErrors;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    if (e.target.name === 'profile_photo') {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          setSnackbar({
            open: true,
            message: 'Please upload an image file',
            severity: 'error'
          });
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setSnackbar({
            open: true,
            message: 'Profile photo must be less than 5MB',
            severity: 'error'
          });
          return;
        }
        setProfilePhoto(file);
        setIsProfilePhotoChanged(true);
      }
    } else if (e.target.name === 'resume') {
      const file = e.target.files[0];
      if (file) {
        if (file.type !== 'application/pdf') {
          setSnackbar({
            open: true,
            message: 'Please upload a PDF file',
            severity: 'error'
          });
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          setSnackbar({
            open: true,
            message: 'Resume must be less than 10MB',
            severity: 'error'
          });
          return;
        }
        setResume(file);
        setIsResumeChanged(true);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      // Clear error when user starts typing
      if (formErrors[e.target.name]) {
        setFormErrors({ ...formErrors, [e.target.name]: null });
      }
    }
  };

  const handleEducationChange = (index, field, value) => {
    const newEducations = [...educations];
    newEducations[index][field] = value;
    setEducations(newEducations);
    
    // Clear error when user starts typing
    if (formErrors.educations?.[index]?.[field]) {
      const newErrors = { ...formErrors };
      if (newErrors.educations?.[index]) {
        delete newErrors.educations[index][field];
        if (Object.keys(newErrors.educations[index]).length === 0) {
          newErrors.educations.splice(index, 1);
          if (newErrors.educations.length === 0) {
            delete newErrors.educations;
          }
        }
      }
      setFormErrors(newErrors);
    }
  };

  const handleWorkExperienceChange = (index, field, value) => {
    const newWorkExperiences = [...workExperiences];
    newWorkExperiences[index][field] = value;
    setWorkExperiences(newWorkExperiences);
    
    // Clear error when user starts typing
    if (formErrors.workExperiences?.[index]?.[field]) {
      const newErrors = { ...formErrors };
      if (newErrors.workExperiences?.[index]) {
        delete newErrors.workExperiences[index][field];
        if (Object.keys(newErrors.workExperiences[index]).length === 0) {
          newErrors.workExperiences.splice(index, 1);
          if (newErrors.workExperiences.length === 0) {
            delete newErrors.workExperiences;
          }
        }
      }
      setFormErrors(newErrors);
    }
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
    
    // Clear error when user starts typing
    if (formErrors.skills?.[index]?.[field]) {
      const newErrors = { ...formErrors };
      if (newErrors.skills?.[index]) {
        delete newErrors.skills[index][field];
        if (Object.keys(newErrors.skills[index]).length === 0) {
          newErrors.skills.splice(index, 1);
          if (newErrors.skills.length === 0) {
            delete newErrors.skills;
          }
        }
      }
      setFormErrors(newErrors);
    }
  };

  const addEducation = () => {
    setEducations([...educations, {
      degree_type: '',
      field_of_study: '',
      institution: '',
      location: '',
      start_date: '',
      end_date: '',
      grade_or_gpa: '',
      description: ''
    }]);
  };

  const addWorkExperience = () => {
    setWorkExperiences([...workExperiences, {
      job_title: '',
      company_name: '',
      company_location: '',
      start_date: '',
      end_date: '',
      technologies_used: ''
    }]);
  };

  const addSkill = () => {
    setSkills([...skills, {
      skill_name: '',
      proficiency_level: '',
      years_of_experience: '',
      certification: '',
      skill_type: 'Technical'
    }]);
  };

  const removeEducation = (index) => {
    const newEducations = educations.filter((_, i) => i !== index);
    setEducations(newEducations);
  };

  const removeWorkExperience = (index) => {
    const newWorkExperiences = workExperiences.filter((_, i) => i !== index);
    setWorkExperiences(newWorkExperiences);
  };

  const removeSkill = (index) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fix the errors before submitting',
        severity: 'error'
      });
      return;
    }

    try {
      const updatedProfile = new FormData();
      
      // Append basic form data
      for (const key in formData) {
        updatedProfile.append(key, formData[key]);
      }

      // Append files only if they've changed
      if (isProfilePhotoChanged && profilePhoto instanceof File) {
        updatedProfile.append('profile_photo', profilePhoto);
      }
      if (isResumeChanged && resume instanceof File) {
        updatedProfile.append('resume', resume);
      }

      // Always append the current state of educations, work experience, and skills
      updatedProfile.append('educations', JSON.stringify(educations));
      updatedProfile.append('work_experience', JSON.stringify(workExperiences));
      updatedProfile.append('skills', JSON.stringify(skills));

      const result = await dispatch(updateProfile(updatedProfile)).unwrap();
      
      // Don't exit editing mode if only files were changed
      const onlyFilesChanged = (isProfilePhotoChanged || isResumeChanged) && 
                             !Object.keys(formData).some(key => formData[key] !== profile[key]);
      
      if (!onlyFilesChanged) {
        setIsEditing(false);
      }

      // Update local state with the returned data
      setEducations(result.localData.educations);
      setWorkExperiences(result.localData.work_experience);
      setSkills(result.localData.skills);

      // Reset file change flags after successful update
      setIsProfilePhotoChanged(false);
      setIsResumeChanged(false);

      setSnackbar({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to update profile',
        severity: 'error'
      });
    }
  };

  const getInterviewForApplication = (applicationId) => {
    return interviews.find(interview => interview.job_application === applicationId);
  };

  const getFeedbackForInterview = (interviewId) => {
    return currentFeedback && currentFeedback.interview_schedule === interviewId
      ? currentFeedback
      : null;
  };

  const renderFeedback = (feedback) => {
    const handleToggleApproval = () => {
      const updatedFeedbackData = {
        ...feedback,
        is_approved: !feedback.is_approved // Toggle the approval state
      };

      dispatch(updateFeedback({ id: feedback.id, feedbackData: updatedFeedbackData }));
    };

    return (
      <div key={feedback.id}>
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Score:</strong> {feedback.score}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Feedback:</strong> {feedback.feedback}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Stage:</strong> {feedback.stage}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          <strong>Approved:</strong> {feedback.is_approved ? 'Yes' : 'No'}
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: feedback.is_approved ? 'green' : 'red', color: 'white' }}
          onClick={handleToggleApproval}
        >
          {feedback.is_approved ? 'Feedback Shown in my public profile' : 'Feedback Hidden in my public profile'}
        </Button>
      </div>
    );
  };
  const renderApplications = () => (
    <div>
      <Typography variant="h6" style={{ marginTop: '16px', fontWeight: 'bold', color: '#333' }}>
        Job Applications
      </Typography>
      <Grid container spacing={2}>
        {applications.map((application) => {
          const interview = getInterviewForApplication(application.id);
          const feedback = interview ? getFeedbackForInterview(interview.id) : null;

          return (
            <Grid item xs={12} sm={6} md={4} key={application.id}>
              <Card 
                sx={{ 
                  mb: 2, 
                  p: 3, 
                  borderRadius: 8, 
                  transition: '0.3s', 
                  '&:hover': { boxShadow: 10 },
                  height: '350px', 
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: '#f9f9f9', // Light background
                }} 
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#00796b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {application.job_details.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Company: {application.job_details.company.name}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    Status: <Chip label={application.status} sx={{ bgcolor: '#00796b', color: 'white' }} />
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    Date Applied: {new Date(application.applied_at).toLocaleDateString()}
                  </Typography>
                  <div style={{ flexGrow: 1 }} /> {/* Spacer to push interview details down */}
                  {/*  <Typography variant="body2" sx={{ marginTop: 1 }}>
                    {interview ? (
                      <div>
                        <strong>Interview Scheduled:</strong>
                        <div>Date: {new Date(interview.scheduled_time).toLocaleDateString()}</div>
                        <div>Time: {new Date(interview.scheduled_time).toLocaleTimeString()}</div>
                        <div>Location: {interview.location}</div>
                      </div>
                    ) : (
                      'No interview scheduled'
                    )}
                  </Typography>*/}
                </CardContent>
                <CardContent sx={{ flexShrink: 0 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {feedback ? renderFeedback(feedback) : 'No feedback available'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );

  if (status === 'loading') {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  if (status === 'failed') {
    return (
      <Container>
        <Alert severity="error">
          Error: {error || 'Something went wrong'}
          <Button 
            color="inherit" 
            size="small"
            onClick={() => dispatch(fetchProfile())}
          >
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!profile) return null;

  return (
    <Container component="main" maxWidth="md">
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        {isEditing ? (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name || ''}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  error={!!formErrors.full_name}
                  helperText={formErrors.full_name}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number || ''}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  error={!!formErrors.phone_number}
                  helperText={formErrors.phone_number}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {formErrors.profile_photo && (
                  <Alert severity="error" sx={{ mb: 1 }}>
                    {formErrors.profile_photo}
                  </Alert>
                )}
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="profile-photo"
                  name="profile_photo"
                  type="file"
                  onChange={handleChange}
                />
                <label htmlFor="profile-photo">
                  <Button variant="contained" color="primary" component="span" fullWidth>
                    Upload Profile Photo
                  </Button>
                </label>
              </Grid>
              <Grid item xs={12}>
                {profilePhotoURL && (
                  <Box
                    sx={{
                      position: 'relative',
                      width: 150,
                      height: 150,
                      margin: '0 auto',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -3,
                        left: -3,
                        right: -3,
                        bottom: -3,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #2196F3, #00BCD4, #4CAF50)',
                        zIndex: 0,
                      },
                    }}
                  >
                    <Avatar
                      src={profilePhotoURL}
                      alt="Profile Photo"
                      sx={{
                        width: '100%',
                        height: '100%',
                        border: '4px solid white',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Bio"
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="LinkedIn URL"
                  name="linkedin_url"
                  value={formData.linkedin_url || ''}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  error={!!formErrors.linkedin_url}
                  helperText={formErrors.linkedin_url}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Portfolio URL"
                  name="portfolio_url"
                  value={formData.portfolio_url || ''}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                  error={!!formErrors.portfolio_url}
                  helperText={formErrors.portfolio_url}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {formErrors.resume && (
                  <Alert severity="error" sx={{ mb: 1 }}>
                    {formErrors.resume}
                  </Alert>
                )}
                <input
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  id="resume"
                  name="resume"
                  type="file"
                  onChange={handleChange}
                />
                <label htmlFor="resume">
                  <Button variant="contained" color="primary" component="span" fullWidth>
                    Upload Resume
                  </Button>
                </label>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Current Job Title"
                  name="current_job_title"
                  value={formData.current_job_title || ''}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Job Preferences"
                  name="job_preferences"
                  value={formData.job_preferences || ''}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Education</Typography>
                {educations.map((education, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth margin="normal" error={!!formErrors.educations?.[index]?.degree_type}>
                        <InputLabel>Degree Type</InputLabel>
                        <Select
                          value={education.degree_type}
                          onChange={(e) => handleEducationChange(index, 'degree_type', e.target.value)}
                          required
                        >
                          <MenuItem value="Diploma">Diploma</MenuItem>
                          <MenuItem value="Bachelor">Bachelor</MenuItem>
                          <MenuItem value="Master">Master</MenuItem>
                          <MenuItem value="PhD">PhD</MenuItem>
                          <MenuItem value="Certification">Certification</MenuItem>
                        </Select>
                        {formErrors.educations?.[index]?.degree_type && (
                          <Typography color="error" variant="caption">
                            {formErrors.educations[index].degree_type}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Field of Study"
                        value={education.field_of_study}
                        onChange={(e) => handleEducationChange(index, 'field_of_study', e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!formErrors.educations?.[index]?.field_of_study}
                        helperText={formErrors.educations?.[index]?.field_of_study}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Institution"
                        value={education.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!formErrors.educations?.[index]?.institution}
                        helperText={formErrors.educations?.[index]?.institution}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Location"
                        value={education.location}
                        onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!formErrors.educations?.[index]?.location}
                        helperText={formErrors.educations?.[index]?.location}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Start Date"
                        type="date"
                        value={education.start_date}
                        onChange={(e) => handleEducationChange(index, 'start_date', e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        required
                        error={!!formErrors.educations?.[index]?.start_date}
                        helperText={formErrors.educations?.[index]?.start_date}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="End Date"
                        type="date"
                        value={education.end_date}
                        onChange={(e) => handleEducationChange(index, 'end_date', e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        required
                        error={!!formErrors.educations?.[index]?.end_date}
                        helperText={formErrors.educations?.[index]?.end_date}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Grade/GPA"
                        value={education.grade_or_gpa}
                        onChange={(e) => handleEducationChange(index, 'grade_or_gpa', e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        value={education.description}
                        onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                        fullWidth
                        multiline
                        rows={2}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <IconButton onClick={() => removeEducation(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button startIcon={<AddIcon />} onClick={addEducation}>
                  Add Education
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Work Experience</Typography>
                {workExperiences.map((experience, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Job Title"
                        value={experience.job_title}
                        onChange={(e) => handleWorkExperienceChange(index, 'job_title', e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!formErrors.workExperiences?.[index]?.job_title}
                        helperText={formErrors.workExperiences?.[index]?.job_title}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Company Name"
                        value={experience.company_name}
                        onChange={(e) => handleWorkExperienceChange(index, 'company_name', e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!formErrors.workExperiences?.[index]?.company_name}
                        helperText={formErrors.workExperiences?.[index]?.company_name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Company Location"
                        value={experience.company_location}
                        onChange={(e) => handleWorkExperienceChange(index, 'company_location', e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!formErrors.workExperiences?.[index]?.company_location}
                        helperText={formErrors.workExperiences?.[index]?.company_location}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Start Date"
                        type="date"
                        value={experience.start_date}
                        onChange={(e) => handleWorkExperienceChange(index, 'start_date', e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        required
                        error={!!formErrors.workExperiences?.[index]?.start_date}
                        helperText={formErrors.workExperiences?.[index]?.start_date}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="End Date"
                        type="date"
                        value={experience.end_date}
                        onChange={(e) => handleWorkExperienceChange(index, 'end_date', e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        margin="normal"
                        required
                        error={!!formErrors.workExperiences?.[index]?.end_date}
                        helperText={formErrors.workExperiences?.[index]?.end_date}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Technologies Used"
                        value={experience.technologies_used}
                        onChange={(e) => handleWorkExperienceChange(index, 'technologies_used', e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!formErrors.workExperiences?.[index]?.technologies_used}
                        helperText={formErrors.workExperiences?.[index]?.technologies_used}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <IconButton onClick={() => removeWorkExperience(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button startIcon={<AddIcon />} onClick={addWorkExperience}>
                  Add Work Experience
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">Skills</Typography>
                {skills.map((skill, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Skill Name"
                        value={skill.skill_name}
                        onChange={(e) => handleSkillChange(index, 'skill_name', e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        error={!!formErrors.skills?.[index]?.skill_name}
                        helperText={formErrors.skills?.[index]?.skill_name}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl 
                        fullWidth 
                        margin="normal" 
                        required
                        error={!!formErrors.skills?.[index]?.proficiency_level}
                      >
                        <InputLabel>Proficiency Level</InputLabel>
                        <Select
                          value={skill.proficiency_level}
                          onChange={(e) => handleSkillChange(index, 'proficiency_level', e.target.value)}
                        >
                          <MenuItem value="Beginner">Beginner</MenuItem>
                          <MenuItem value="Intermediate">Intermediate</MenuItem>
                          <MenuItem value="Advanced">Advanced</MenuItem>
                          <MenuItem value="Expert">Expert</MenuItem>
                        </Select>
                        {formErrors.skills?.[index]?.proficiency_level && (
                          <Typography color="error" variant="caption">
                            {formErrors.skills[index].proficiency_level}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Years of Experience"
                        type="number"
                        value={skill.years_of_experience}
                        onChange={(e) => handleSkillChange(index, 'years_of_experience', e.target.value)}
                        fullWidth
                        margin="normal"
                        required
                        inputProps={{ min: "0", step: "0.5" }}
                        error={!!formErrors.skills?.[index]?.years_of_experience}
                        helperText={formErrors.skills?.[index]?.years_of_experience}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Certification"
                        value={skill.certification}
                        onChange={(e) => handleSkillChange(index, 'certification', e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl 
                        fullWidth 
                        margin="normal"
                        required
                        error={!!formErrors.skills?.[index]?.skill_type}
                      >
                        <InputLabel>Skill Type</InputLabel>
                        <Select
                          value={skill.skill_type}
                          onChange={(e) => handleSkillChange(index, 'skill_type', e.target.value)}
                        >
                          <MenuItem value="Technical">Technical</MenuItem>
                          <MenuItem value="Soft">Soft</MenuItem>
                        </Select>
                        {formErrors.skills?.[index]?.skill_type && (
                          <Typography color="error" variant="caption">
                            {formErrors.skills[index].skill_type}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <IconButton onClick={() => removeSkill(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button startIcon={<AddIcon />} onClick={addSkill}>
                  Add Skill
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: '16px' }}
                >
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <div>
            <Card sx={{ 
              mb: 2, 
              p: 2, 
              borderRadius: 3, 
              transition: '.3s', 
              '&:hover': { 
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              },
              background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)'
            }}>
              <CardContent>
                <Box
                  sx={{
                    position: 'relative',
                    width: 200,
                    height: 200,
                    margin: '0 auto 2rem',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -4,
                      left: -4,
                      right: -4,
                      bottom: -4,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, #2196F3, #00BCD4, #4CAF50)',
                      animation: 'spin 4s linear infinite',
                      zIndex: 0,
                    },
                    '@keyframes spin': {
                      '0%': {
                        transform: 'rotate(0deg)',
                      },
                      '100%': {
                        transform: 'rotate(360deg)',
                      },
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={profilePhotoURL}
                    alt="Profile Photo"
                    sx={{
                      borderRadius: '50%',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      border: '4px solid white',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                      position: 'relative',
                      zIndex: 1,
                      backgroundColor: '#fff',
                    }}
                  />
                </Box>
                <Typography 
                  gutterBottom 
                  variant="h4" 
                  component="div"
                  sx={{
                    textAlign: 'center',
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #2196F3, #00BCD4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 3
                  }}
                >
                  {formData.full_name}
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gap: 2,
                  '& .MuiTypography-root': {
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    transition: '0.3s',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.04)',
                    }
                  }
                }}>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <strong>Phone Number:</strong> {formData.phone_number}
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <strong>Date of Birth:</strong> {formData.date_of_birth}
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <strong>Bio:</strong> {formData.bio}
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <strong>LinkedIn:</strong> 
                    <a 
                      href={formData.linkedin_url}
                      style={{
                        color: '#0077B5',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      {formData.linkedin_url}
                    </a>
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <strong>Portfolio:</strong> 
                    <a 
                      href={formData.portfolio_url}
                      style={{
                        color: '#2196F3',
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      {formData.portfolio_url}
                    </a>
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Divider sx={{ my: 4 }} />

            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                color: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                '&::after': {
                  content: '""',
                  flex: 1,
                  height: '2px',
                  background: 'linear-gradient(to right, rgba(33, 150, 243, 0.5), rgba(0, 0, 0, 0.05))',
                  ml: 2
                }
              }}
            >
              Education
            </Typography>
            <Box sx={{ display: 'grid', gap: 3 }}>
              {educations.map((education, index) => (
                <Card 
                  key={index}
                  sx={{ 
                    p: 2,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>
                    {education.degree_type} in {education.field_of_study}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
                    {education.institution}, {education.location}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888', mb: 1 }}>
                    {education.start_date} - {education.end_date}
                  </Typography>
                  {education.grade_or_gpa && (
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      Grade/GPA: <strong>{education.grade_or_gpa}</strong>
                    </Typography>
                  )}
                  {education.description && (
                    <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      {education.description}
                    </Typography>
                  )}
                </Card>
              ))}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                color: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                '&::after': {
                  content: '""',
                  flex: 1,
                  height: '2px',
                  background: 'linear-gradient(to right, rgba(33, 150, 243, 0.5), rgba(0, 0, 0, 0.05))',
                  ml: 2
                }
              }}
            >
              Work Experience
            </Typography>
            <Box sx={{ display: 'grid', gap: 3 }}>
              {workExperiences.map((experience, index) => (
                <Card 
                  key={index}
                  sx={{ 
                    p: 2,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>
                    {experience.job_title}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#666', mb: 1 }}>
                    {experience.company_name}, {experience.company_location}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#888', mb: 2 }}>
                    {experience.start_date} - {experience.end_date}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {experience.technologies_used.split(',').map((tech, i) => (
                      <Chip 
                        key={i} 
                        label={tech.trim()} 
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(25, 118, 210, 0.08)',
                          color: '#1976d2',
                          '&:hover': {
                            bgcolor: 'rgba(25, 118, 210, 0.12)',
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Card>
              ))}
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                color: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                '&::after': {
                  content: '""',
                  flex: 1,
                  height: '2px',
                  background: 'linear-gradient(to right, rgba(33, 150, 243, 0.5), rgba(0, 0, 0, 0.05))',
                  ml: 2
                }
              }}
            >
              Skills
            </Typography>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
              {skills.map((skill, index) => (
                <Card 
                  key={index}
                  sx={{ 
                    p: 2,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: '0.3s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                      {skill.skill_name}
                    </Typography>
                    <Chip 
                      label={skill.proficiency_level} 
                      size="small"
                      sx={{ 
                        bgcolor: 
                          skill.proficiency_level === 'Expert' ? 'rgba(76, 175, 80, 0.1)' :
                          skill.proficiency_level === 'Advanced' ? 'rgba(33, 150, 243, 0.1)' :
                          skill.proficiency_level === 'Intermediate' ? 'rgba(255, 152, 0, 0.1)' :
                          'rgba(158, 158, 158, 0.1)',
                        color:
                          skill.proficiency_level === 'Expert' ? '#4CAF50' :
                          skill.proficiency_level === 'Advanced' ? '#2196F3' :
                          skill.proficiency_level === 'Intermediate' ? '#FF9800' :
                          '#9E9E9E'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {skill.years_of_experience} years of experience
                  </Typography>
                  {skill.certification && (
                    <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                      Certification: {skill.certification}
                    </Typography>
                  )}
                  <Chip 
                    label={skill.skill_type} 
                    size="small"
                    sx={{ 
                      mt: 1,
                      bgcolor: skill.skill_type === 'Technical' ? 'rgba(33, 150, 243, 0.08)' : 'rgba(156, 39, 176, 0.08)',
                      color: skill.skill_type === 'Technical' ? '#1976d2' : '#9c27b0'
                    }}
                  />
                </Card>
              ))}
            </Box>

            {renderApplications()}
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsEditing(true)}
              style={{ marginTop: '16px' }}
            >
              Edit Profile
            </Button>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;