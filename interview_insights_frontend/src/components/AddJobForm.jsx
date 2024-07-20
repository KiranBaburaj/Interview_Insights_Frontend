import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addJob, fetchJobs, updateJob, deleteJob, selectAllJobs } from '../features/jobs/jobsSlice';
import { fetchJobCategories, selectAllCategories, addCategory } from '../features/jobCategories/jobCategoriesSlice';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,  Chip
} from '@mui/material';

const JobManagement = () => {
  const dispatch = useDispatch();
  const [jobData, setJobData] = useState({
    id: null,
    title: '',
    description: '',
    responsibilities: '',
    qualifications: '',
    nice_to_have: '',
    employment_type: '',
    location: '',
    salary_min: '',
    salary_max: '',
    is_remote: false,
    application_deadline: '',
    experience_level: '',
    job_function: '',
    categories: [],
  });
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [error, setError] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const categories = useSelector(selectAllCategories);
  const categoriesStatus = useSelector((state) => state.jobCategories.status);
  const categoriesError = useSelector((state) => state.jobCategories.error);
  const jobs = useSelector(selectAllJobs);
  const jobsStatus = useSelector((state) => state.jobs.status);

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchJobCategories());
    }
    if (jobsStatus === 'idle') {
      dispatch(fetchJobs());
    }
  }, [categoriesStatus, jobsStatus, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJobData({
      ...jobData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    const updatedCategories = value.map((catId) => {
      const category = categories.find((cat) => cat.id === catId);
      return category ? { category: category.name } : null; // Remove unknown categories
    }).filter(cat => cat !== null); // Remove null entries

    setJobData({
      ...jobData,
      categories: updatedCategories,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!user || !user.id) {
      console.error('User data is missing or incomplete');
      setError('User data is missing. Please try logging in again.');
      return;
    }

    const jobDataToSend = {
      ...jobData,
      employer: user.id,
    };

    console.log('Submitting job data:', jobDataToSend);

    if (jobData.id) {
      console.log('Updating job with ID:', jobData.id);
      dispatch(updateJob({ jobId: jobData.id, jobData: jobDataToSend }))
        .unwrap()
        .then(() => resetForm())
        .catch((err) => setError(err.message || 'An error occurred while updating the job.'));
    } else {
      dispatch(addJob(jobDataToSend))
        .unwrap()
        .then(() => resetForm())
        .catch((err) => setError(err.message || 'An error occurred while adding the job.'));
    }
  };

  const resetForm = () => {
    setJobData({
      id: null,
      title: '',
      description: '',
      responsibilities: '',
      qualifications: '',
      nice_to_have: '',
      employment_type: '',
      location: '',
      salary_min: '',
      salary_max: '',
      is_remote: false,
      application_deadline: '',
      experience_level: '',
      job_function: '',
      categories: [],
    });
  };

  const handleEdit = (job) => {
    console.log('Editing job with ID:', job.id);
    setJobData({
      id: job.id,
      title: job.title,
      description: job.description,
      responsibilities: job.responsibilities,
      qualifications: job.qualifications,
      nice_to_have: job.nice_to_have,
      employment_type: job.employment_type,
      location: job.location,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      is_remote: job.is_remote,
      application_deadline: job.application_deadline,
      experience_level: job.experience_level,
      job_function: job.job_function,
      categories: job.categories.map((cat) => ({ category: cat.name })),
    });
  };

  const handleDelete = (jobId) => {
    console.log('Deleting job with ID:', jobId);
    dispatch(deleteJob(jobId))
      .unwrap()
      .catch((err) => setError(err.message || 'An error occurred while deleting the job.'));
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setViewDialogOpen(true);
  };

  const handleAddCategory = () => {
    dispatch(addCategory({ name: newCategory }));
    setOpenDialog(false);
    setNewCategory('');
  };

  if (categoriesStatus === 'loading' || jobsStatus === 'loading') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (categoriesStatus === 'failed' || jobsStatus === 'failed') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">
          Error: {categoriesError || 'Failed to load jobs.'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Job Management
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mx: 'auto', maxWidth: 600 }}>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            fullWidth
            margin="normal"
            label="Job Title"
            name="title"
            value={jobData.title}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Job Description"
            name="description"
            value={jobData.description}
            onChange={handleChange}
            required
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Responsibilities"
            name="responsibilities"
            value={jobData.responsibilities}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Qualifications"
            name="qualifications"
            value={jobData.qualifications}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Nice to Have"
            name="nice_to_have"
            value={jobData.nice_to_have}
            onChange={handleChange}
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Employment Type"
            name="employment_type"
            value={jobData.employment_type}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Location"
            name="location"
            value={jobData.location}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Salary Min"
            name="salary_min"
            value={jobData.salary_min}
            onChange={handleChange}
            type="number"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Salary Max"
            name="salary_max"
            value={jobData.salary_max}
            onChange={handleChange}
            type="number"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="is_remote"
                checked={jobData.is_remote}
                onChange={handleChange}
              />
            }
            label="Remote"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Application Deadline"
            name="application_deadline"
            type="date"
            value={jobData.application_deadline}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Experience Level"
            name="experience_level"
            value={jobData.experience_level}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Job Function"
            name="job_function"
            value={jobData.job_function}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Job Categories</InputLabel>
            <Select
              multiple
              value={jobData.categories.map((cat) => categories.find((c) => c.name === cat.category)?.id)}
              onChange={handleCategoryChange}
              renderValue={(selected) => (
                <div>
                  {selected.map((value) => (
                    <Chip key={value} label={categories.find((cat) => cat.id === value)?.name} />
                  ))}
                </div>
              )}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Checkbox checked={jobData.categories.some((cat) => cat.category === category.name)} />
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              {jobData.id ? 'Update Job' : 'Add Job'}
            </Button>
            <Button variant="outlined" color="primary" onClick={() => setOpenDialog(true)}>
              Add Category
            </Button>
          </Box>
        </Box>
      </Paper>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Job Listings
        </Typography>
        {jobs.map((job) => (
          <Paper key={job.id} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6">{job.title}</Typography>
            <Typography>{job.description}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleViewJob(job)}
                sx={{ mr: 1 }}
              >
                View Job
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleEdit(job)}
                sx={{ mr: 1 }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleDelete(job.id)}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the name of the new category you want to add.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCategory} color="primary">
            Add Category
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box>
              <Typography variant="h6">{selectedJob.title}</Typography>
              <Typography>Description: {selectedJob.description}</Typography>
              <Typography>Responsibilities: {selectedJob.responsibilities}</Typography>
              <Typography>Qualifications: {selectedJob.qualifications}</Typography>
              <Typography>Nice to Have: {selectedJob.nice_to_have}</Typography>
              <Typography>Employment Type: {selectedJob.employment_type}</Typography>
              <Typography>Location: {selectedJob.location}</Typography>
              <Typography>Salary: {selectedJob.salary_min} - {selectedJob.salary_max}</Typography>
              <Typography>Remote: {selectedJob.is_remote ? 'Yes' : 'No'}</Typography>
              <Typography>Application Deadline: {selectedJob.application_deadline}</Typography>
              <Typography>Experience Level: {selectedJob.experience_level}</Typography>
              <Typography>Job Function: {selectedJob.job_function}</Typography>
              <Typography>Categories: {selectedJob.categories.map(cat => cat.category).join(', ')}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobManagement;
