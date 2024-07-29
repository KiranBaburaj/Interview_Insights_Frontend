import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addJob,
  fetchJobs,
  updateJob,
  deleteJob,
  selectAllJobs,
} from '../features/jobs/jobsSlice';
import {
  fetchJobCategories,
  selectAllCategories,
  addCategory,
} from '../features/jobCategories/jobCategoriesSlice';
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
  Paper,
  Chip,
} from '@mui/material';

const JobManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const [isFormVisible, setIsFormVisible] = useState(false);

  const categories = useSelector(selectAllCategories);
  console.log()
  const categoriesStatus = useSelector((state) => state.jobCategories.status);
  const categoriesError = useSelector((state) => state.jobCategories.error);
  const jobs = useSelector(selectAllJobs);
  const jobsStatus = useSelector((state) => state.jobs.status);

  useEffect(() => {

      dispatch(fetchJobCategories());

      dispatch(fetchJobs());
    
  }, [isFormVisible,openDialog]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJobData({
      ...jobData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    const updatedCategories = categories.filter(cat => value.includes(cat.id)).map(cat => ({ category: cat.name }));

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
        .then(() => {
          resetForm();
          setIsFormVisible(false);
        })
        .catch((err) => setError(err.message || 'An error occurred while updating the job.'));
    } else {
      dispatch(addJob(jobDataToSend))
        .unwrap()
        .then(() => {
          resetForm();
          setIsFormVisible(false);
        })
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
    setIsFormVisible(true);
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
    if (newCategory.trim() === '') {
      setError('Category name cannot be empty');
      return;
    }

    dispatch(addCategory({ name: newCategory }))
      .unwrap()
      .then(() => {
        setOpenDialog(false);
        setNewCategory('');
      })
      .catch((err) => setError(err.message || 'An error occurred while adding the category.'));
  };

  const handleViewApplicants = (jobId) => {
    console.log('Viewing applicants for job with ID:', jobId);
    navigate(`/EmployerJobapplicants/${jobId}`);
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
        <Box sx={{ mb: 2 }}>
          <Button variant="contained" color="primary" onClick={() => setIsFormVisible(true)} sx={{ mr: 1 }}>
            Create Job
          </Button>
          <Button variant="contained" color="secondary" onClick={() => setOpenDialog(true)}>
            Add Category
          </Button>
        </Box>
        {isFormVisible && (
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
                  checked={jobData.is_remote}
                  onChange={handleChange}
                  name="is_remote"
                />
              }
              label="Remote"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Application Deadline"
              name="application_deadline"
              value={jobData.application_deadline}
              onChange={handleChange}
              type="date"
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
              <InputLabel>Categories</InputLabel>
              <Select
                multiple
                value={jobData.categories.map(cat => cat.category)}
                onChange={handleCategoryChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    <ListItemText primary={cat.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" type="submit">
              {jobData.id ? 'Update Job' : 'Add Job'}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                resetForm();
                setIsFormVisible(false);
              }}
            >
              Cancel
            </Button>
          </Box>
        )}
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Job Listings
        </Typography>
        <Box>
          {jobs.map((job) => (
            <Paper key={job.id} elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{job.title}</Typography>
              <Typography variant="body2">{job.description}</Typography>
              <Button variant="contained" color="primary" onClick={() => handleEdit(job)}>
                Edit
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => handleDelete(job.id)}>
                Delete
              </Button>
              <Button variant="outlined" color="info" onClick={() => handleViewApplicants(job.id)}>
                View Applicants
              </Button>
              <Button variant="outlined" color="info" onClick={() => handleViewJob(job)}>
                View Details
              </Button>
            </Paper>
          ))}
        </Box>
      </Paper>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of the new category you want to add.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            variant="standard"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddCategory}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
        <DialogTitle>Job Details</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <Box>
              <Typography variant="h6">{selectedJob.title}</Typography>
              <Typography variant="body2">{selectedJob.description}</Typography>
              {/* Display other job details as needed */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobManagement;
