import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField, Button, Container, Grid, Typography, Paper, Avatar, Card, CardContent, CardMedia, CardActionArea,
  Select, MenuItem, FormControl, InputLabel, IconButton, Switch, Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { fetchProfile, updateProfile } from '../../features/jobseeker/jobseekerSlice2';
import { fetchApplications } from '../../features/applications/applicationsSlice';
import { fetchInterviews, fetchFeedback } from '../../features/interview/interviewSlice';
const VISIBLE_APPLICATIONS_KEY = 'visibleApplications';
const Profile = () => {
  
  const [visibleApplications, setVisibleApplications] = useState(() => {
    const savedVisibleApplications = localStorage.getItem(VISIBLE_APPLICATIONS_KEY);
    return savedVisibleApplications ? JSON.parse(savedVisibleApplications) : [];
  });
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
  const [displayedApplications, setDisplayedApplications] = useState({});

  const dispatch = useDispatch();

  const applicationData = useSelector((state) => state.myapplications.applications);
  const interviews = useSelector((state) => state.interviews.interviews);
  const currentFeedback = useSelector((state) => state.interviews.currentFeedback);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchApplications());
    dispatch(fetchInterviews());
  }, [dispatch]);

  useEffect(() => {
    if (interviews.length > 0) {
      interviews.forEach(interview => {
        dispatch(fetchFeedback(interview.id));
      });
    }
  }, [dispatch, interviews]);

  useEffect(() => {
    if (profile && profile.visible_applications) {
      setVisibleApplications(profile.visible_applications);
      localStorage.setItem(VISIBLE_APPLICATIONS_KEY, JSON.stringify(profile.visible_applications));
    }
  }, [profile]);
  useEffect(() => {
    if (applicationData) {
      setApplications(applicationData);
      const initialDisplayState = applicationData.reduce((acc, app) => {
        acc[app.id] = true; // Default to displaying all applications
        return acc;
      }, {});
      setDisplayedApplications(initialDisplayState);
    }
  }, [applicationData]);


  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.user?.full_name || '',
        phone_number: profile.phone_number || '',
        date_of_birth: profile.date_of_birth || '',
        bio: profile.bio || '',
        linkedin_url: profile.linkedin_url || '',
        portfolio_url: profile.portfolio_url || '',
        current_job_title: profile.current_job_title || '',
        job_preferences: profile.job_preferences || '',
        visible_applications: Array.isArray(profile.visible_applications) 
        ? profile.visible_applications 
        : [],
        
      });
      if (Array.isArray(profile.visible_applications)) {
        setVisibleApplications(profile.visible_applications);
        localStorage.setItem(VISIBLE_APPLICATIONS_KEY, JSON.stringify(profile.visible_applications));
      }
      setEducations(profile.educations?.map(edu => ({...edu})) || []);
      setWorkExperiences(profile.work_experience?.map(exp => ({...exp})) || []);
      setSkills(profile.skills?.map(skill => ({...skill})) || []);
      setProfilePhoto(profile.profile_photo);
      setResume(profile.resume);
    }
  }, [profile]);

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

  const handleChange = (e) => {
    if (e.target.name === 'profile_photo') {
      setProfilePhoto(e.target.files[0]);
      setIsProfilePhotoChanged(true);
    } else if (e.target.name === 'resume') {
      setResume(e.target.files[0]);
      setIsResumeChanged(true);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleEducationChange = (index, field, value) => {
    const newEducations = [...educations];
    newEducations[index][field] = value;
    setEducations(newEducations);
  };

  const handleWorkExperienceChange = (index, field, value) => {
    const newWorkExperiences = [...workExperiences];
    newWorkExperiences[index][field] = value;
    setWorkExperiences(newWorkExperiences);
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
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
  const handleApplicationDisplayToggle = (applicationId) => {
    setDisplayedApplications(prev => ({
      ...prev,
      [applicationId]: !prev[applicationId]
    }));
  };

  const getInterviewForApplication = (applicationId) => {
    return interviews.find(interview => interview.job_application === applicationId);
  };

  const getFeedbackForInterview = (interviewId) => {
    return currentFeedback && currentFeedback.interview_schedule === interviewId
      ? currentFeedback
      : null;
  };
  const handleApplicationVisibilityToggle = (applicationId) => {
    setVisibleApplications(prevVisible => {
      const currentVisible = Array.isArray(prevVisible) ? prevVisible : [];
      
      const updatedVisible = currentVisible.includes(applicationId)
        ? currentVisible.filter(id => id !== applicationId)
        : [...currentVisible, applicationId];
      
      localStorage.setItem(VISIBLE_APPLICATIONS_KEY, JSON.stringify(updatedVisible));
      
      // Update formData
      setFormData(prevFormData => ({
        ...prevFormData,
        visible_applications: updatedVisible,
      }));
      
      // Update the profile in the backend
      const updatedProfile = new FormData();
      updatedProfile.append('visible_applications', JSON.stringify(updatedVisible));
      dispatch(updateProfile(updatedProfile));
      
      return updatedVisible;
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = new FormData();
    for (const key in formData) {
      updatedProfile.append(key, formData[key]);
      if (key === 'visible_applications') {
        updatedProfile.append(key, JSON.stringify(formData[key]));
      } else {
        updatedProfile.append(key, formData[key]);
      }
    }
    
    if (isProfilePhotoChanged && profilePhoto instanceof File) {
      updatedProfile.append('profile_photo', profilePhoto);
    }
    if (isResumeChanged && resume instanceof File) {
      updatedProfile.append('resume', resume);
    }
    updatedProfile.append('educations', JSON.stringify(educations));
    updatedProfile.append('work_experience', JSON.stringify(workExperiences));
    updatedProfile.append('skills', JSON.stringify(skills));
    dispatch(updateProfile(updatedProfile));
    setIsEditing(false);
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  if (!profile) return null;

  const renderApplications = () => (
    <div>
      <Typography variant="h6" style={{ marginTop: '16px' }}>Job Applications</Typography>
      {applications.map((application) => {
        const interview = getInterviewForApplication(application.id);
        const feedback = interview ? getFeedbackForInterview(interview.id) : null;
        const isVisible = visibleApplications.includes(application.id);
        return (
          <div key={application.id}>
            <Switch
              checked={isVisible}
              onChange={() => handleApplicationVisibilityToggle(application.id)}
            />
            {isVisible && (
              <Card>
                <CardContent>
                  {/* Application details */}
                  <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Company:</strong> {application.job_details.company.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Job Title:</strong> {application.job_details.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" >
                    <strong>Status:</strong> <Chip label={application.status} />
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Date Applied:</strong> {new Date(application.applied_at).toLocaleDateString()}
                  </Typography>
                  {interview && (
                    <div>
                      <Typography variant="body2" color="textSecondary" component="p">
                        <strong>Interview Date:</strong> {new Date(interview.scheduled_time).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        <strong>Interview Time:</strong> {new Date(interview.scheduled_time).toLocaleTimeString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        <strong>Interview Location:</strong> {interview.location}
                      </Typography>
                    </div>
                  )}
                  {feedback && (
                    <div>
                      <Typography variant="body2" color="textSecondary" component="p">
                        <strong>Feedback Score:</strong> {feedback.score}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        <strong>Feedback:</strong> {feedback.feedback}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        <strong>Stage:</strong> {feedback.stage}
                      </Typography>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} style={{ padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        {isEditing ? (
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Grid container spacing={2}>
              {/* Basic Information */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name || ''}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
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
                  <Avatar
                    src={profilePhotoURL}
                    alt="Profile Photo"
                    sx={{ width: 100, height: 100 }}
                  />
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
                />
              </Grid>
              <Grid item xs={12} sm={6}>
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

              {/* Education */}
              <Grid item xs={12}>
                <Typography variant="h6">Education</Typography>
                {educations.map((education, index) => (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Degree Type</InputLabel>
                        <Select
                          value={education.degree_type}
                          onChange={(e) => handleEducationChange(index, 'degree_type', e.target.value)}
                        >
                          <MenuItem value="Diploma">Diploma</MenuItem>
                          <MenuItem value="Bachelor">Bachelor</MenuItem>
                          <MenuItem value="Master">Master</MenuItem>
                          <MenuItem value="PhD">PhD</MenuItem>
                          <MenuItem value="Certification">Certification</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Field of Study"
                        value={education.field_of_study}
                        onChange={(e) => handleEducationChange(index, 'field_of_study', e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Institution"
                        value={education.institution}
                        onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Location"
                        value={education.location}
                        onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                        fullWidth
                        margin="normal"
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

            {/* Work Experience (continued) */}
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
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Company Name"
                        value={experience.company_name}
                        onChange={(e) => handleWorkExperienceChange(index, 'company_name', e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Company Location"
                        value={experience.company_location}
                        onChange={(e) => handleWorkExperienceChange(index, 'company_location', e.target.value)}
                        fullWidth
                        margin="normal"
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
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Technologies Used"
                        value={experience.technologies_used}
                        onChange={(e) => handleWorkExperienceChange(index, 'technologies_used', e.target.value)}
                        fullWidth
                        margin="normal"
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

              {/* Skills */}
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
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth margin="normal">
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
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Skill Type</InputLabel>
                        <Select
                          value={skill.skill_type}
                          onChange={(e) => handleSkillChange(index, 'skill_type', e.target.value)}
                        >
                          <MenuItem value="Technical">Technical</MenuItem>
                          <MenuItem value="Soft">Soft</MenuItem>
                        </Select>
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
            <Card>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image={profilePhotoURL}
                  alt="Profile Photo"
                  sx={{ 
                    borderRadius: '50%', 
                    width: '200px', 
                    height: '200px', 
                    objectFit: 'cover',
                    margin: 'auto'
                  }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {formData.full_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Phone Number:</strong> {formData.phone_number}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Date of Birth:</strong> {formData.date_of_birth}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Bio:</strong> {formData.bio}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    <strong>LinkedIn URL:</strong> <a href={formData.linkedin_url}>{formData.linkedin_url}</a>
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Portfolio URL:</strong> <a href={formData.portfolio_url}>{formData.portfolio_url}</a>
                  </Typography>
                  {resumeURL && (
                    <Typography variant="body2" color="textSecondary" component="p">
                      <strong>Resume:</strong> <a href={resumeURL} target="_blank" rel="noopener noreferrer">View Resume</a>
                    </Typography>
                  )}
                  <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Current Job Title:</strong> {formData.current_job_title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Job Preferences:</strong> {formData.job_preferences}
                  </Typography>

                  <Typography variant="h6" style={{ marginTop: '16px' }}>Education</Typography>
                  {educations.map((education, index) => (
                    <div key={index}>
                      <Typography variant="body2" color="textSecondary" component="p">
                        <strong>{education.degree_type} in {education.field_of_study}</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {education.institution}, {education.location}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {education.start_date} - {education.end_date}
                      </Typography>
                      {education.grade_or_gpa && (
                        <Typography variant="body2" color="textSecondary" component="p">
                          Grade/GPA: {education.grade_or_gpa}
                        </Typography>
                      )}
                      {education.description && (
                        <Typography variant="body2" color="textSecondary" component="p">
                          {education.description}
                        </Typography>
                      )}
                    </div>
                  ))}

                  <Typography variant="h6" style={{ marginTop: '16px' }}>Work Experience</Typography>
                  {workExperiences.map((experience, index) => (
                    <div key={index}>
                      <Typography variant="body2" color="textSecondary" component="p">
                        <strong>{experience.job_title}</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {experience.company_name}, {experience.company_location}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {experience.start_date} - {experience.end_date}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        Technologies: {experience.technologies_used}
                      </Typography>
                    </div>
                  ))}

                  <Typography variant="h6" style={{ marginTop: '16px' }}>Skills</Typography>
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <Typography variant="body2" color="textSecondary" component="p">
                        <strong>{skill.skill_name}</strong> - {skill.proficiency_level}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        Years of Experience: {skill.years_of_experience}
                      </Typography>
                      {skill.certification && (
                        <Typography variant="body2" color="textSecondary" component="p">
                          Certification: {skill.certification}
                        </Typography>
                      )}
                      <Typography variant="body2" color="textSecondary" component="p">
                        Type: {skill.skill_type}
                      </Typography>
                    </div>
                  ))}
                </CardContent>
              </CardActionArea>
            </Card>
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