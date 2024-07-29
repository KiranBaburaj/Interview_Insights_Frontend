import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField, Button, Container, Grid, Typography, Paper, Avatar, Card, CardContent, CardMedia, CardActionArea
} from '@mui/material';
import { fetchProfile, updateProfile } from '../../features/jobseeker/jobseekerSlice2';

const Profile = () => {
  const dispatch = useDispatch();
  const { data: profile, status, error } = useSelector((state) => state.profile);
  const [formData, setFormData] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfilePhotoChanged, setIsProfilePhotoChanged] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.user.full_name || '',
        phone_number: profile.phone_number || '',
        date_of_birth: profile.date_of_birth || '',
        bio: profile.bio || '',
        linkedin_url: profile.linkedin_url || '',
        portfolio_url: profile.portfolio_url || '',
        resume_url: profile.resume_url || '',
        current_job_title: profile.current_job_title || '',
        job_preferences: profile.job_preferences || '',
      });
      setProfilePhoto(profile.profile_photo);
    }
  }, [profile]);

  const handleChange = (e) => {
    if (e.target.name === 'profile_photo') {
      setProfilePhoto(e.target.files[0]);
      setIsProfilePhotoChanged(true);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = new FormData();
    for (const key in formData) {
      updatedProfile.append(key, formData[key]);
    }
    if (isProfilePhotoChanged) {
      updatedProfile.append('profile_photo', profilePhoto);
    }
    dispatch(updateProfile(updatedProfile));
    setIsEditing(false);
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error: {error}</div>;
  if (!profile) return null;

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} style={{ padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
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
                {profilePhoto && (
                  <Avatar
                    src={typeof profilePhoto === 'string' ? profilePhoto : URL.createObjectURL(profilePhoto)}
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
                <TextField
                  label="Resume URL"
                  name="resume_url"
                  value={formData.resume_url || ''}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  margin="normal"
                />
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
  image={typeof profilePhoto === 'string' ? profilePhoto : URL.createObjectURL(profilePhoto)}
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
                    <strong>LinkedIn URL:</strong> {formData.linkedin_url}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Portfolio URL:</strong> {formData.portfolio_url}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Resume URL:</strong> {formData.resume_url}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Current Job Title:</strong> {formData.current_job_title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    <strong>Job Preferences:</strong> {formData.job_preferences}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
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
