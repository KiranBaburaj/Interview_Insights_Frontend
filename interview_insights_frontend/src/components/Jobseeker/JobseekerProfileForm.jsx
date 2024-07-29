import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../../features/jobseeker/jobseekerSlice2';
import { Container, TextField, Button, Typography, Grid, Box, Avatar } from '@mui/material';

const Profile = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.profile);
  console.log(data)
  const [formData, setFormData] = useState({
    user: { full_name: '', email: '' },
    phone_number: '',
    date_of_birth: '',
    profile_photo: null,
    bio: '',
    linkedin_url: '',
    portfolio_url: '',
    resume_url: '',
    current_job_title: '',
    job_preferences: ''
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (data && data.user) {
      setFormData({
        user: { full_name: data.user.full_name || '', email: data.user.email || '' },
        phone_number: data.phone_number || '',
        date_of_birth: data.date_of_birth || '',
        profile_photo: null,
        bio: data.bio || '',
        linkedin_url: data.linkedin_url || '',
        portfolio_url: data.portfolio_url || '',
        resume_url: data.resume_url || '',
        current_job_title: data.current_job_title || '',
        job_preferences: data.job_preferences || ''
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('user.')) {
      const userField = name.split('.')[1];
      setFormData((prevState) => ({
        ...prevState,
        user: { ...prevState.user, [userField]: value }
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updateData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'user') {
        Object.keys(formData.user).forEach((userKey) => {
          updateData.append(`user.${userKey}`, formData.user[userKey]);
        });
      } else {
        updateData.append(key, formData[key]);
      }
    });
    dispatch(updateProfile(updateData));
  };

  if (status === 'loading') return <Typography variant="h6">Loading...</Typography>;
  if (status === 'failed') return <Typography variant="h6" color="error">Error: {error}</Typography>;

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="user.full_name"
              value={formData.user.full_name || ''}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="user.email"
              value={formData.user.email || ''}
              onChange={handleChange}
              variant="outlined"
              type="email"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number || ''}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="date_of_birth"
              value={formData.date_of_birth || ''}
              onChange={handleChange}
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <input
              accept="image/*"
              type="file"
              name="profile_photo"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="profile-photo-upload"
            />
            <label htmlFor="profile-photo-upload">
              <Button variant="outlined" component="span" fullWidth>
                Upload Profile Photo
              </Button>
            </label>
            {formData.profile_photo && (
              <Avatar
                src={URL.createObjectURL(formData.profile_photo)}
                alt="Profile Photo"
                sx={{ width: 100, height: 100, mt: 2 }}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="LinkedIn URL"
              name="linkedin_url"
              value={formData.linkedin_url || ''}
              onChange={handleChange}
              variant="outlined"
              type="url"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Portfolio URL"
              name="portfolio_url"
              value={formData.portfolio_url || ''}
              onChange={handleChange}
              variant="outlined"
              type="url"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Resume URL"
              name="resume_url"
              value={formData.resume_url || ''}
              onChange={handleChange}
              variant="outlined"
              type="url"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Job Title"
              name="current_job_title"
              value={formData.current_job_title || ''}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Job Preferences"
              name="job_preferences"
              value={formData.job_preferences || ''}
              onChange={handleChange}
              variant="outlined"
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default Profile;
