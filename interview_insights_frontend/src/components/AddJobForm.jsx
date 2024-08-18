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
  fetchJobSkills,
  selectAllSkills,
  addSkill,
} from '../features/jobSkills/jobSkillsSlice';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Employment type choices according to Django model
const EMPLOYMENT_TYPE_CHOICES = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Temporary', label: 'Temporary' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Freelance', label: 'Freelance' },
];

// Experience level choices according to Django model
const EXPERIENCE_LEVEL_CHOICES = [
  { value: 'Entry level', label: 'Entry level' },
  { value: 'Mid level', label: 'Mid level' },
  { value: 'Senior level', label: 'Senior level' },
  { value: 'Executive', label: 'Executive' },
];

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#00796b',
    },
    secondary: {
      main: '#b2dfdb',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 'bold',
    },
    h6: {
      fontFamily: 'Montserrat, sans-serif',
      fontWeight: 'bold',
    },
  }
});

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
    skills_required: [],
    status: 'open', // Default status
  });

  const { userid } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [error, setError] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const categories = useSelector(selectAllCategories);
  const skills = useSelector(selectAllSkills);
  const categoriesStatus = useSelector((state) => state.jobCategories.status);
  const categoriesError = useSelector((state) => state.jobCategories.error);
  const jobs = useSelector(selectAllJobs);
  const jobsStatus = useSelector((state) => state.jobs.status);

  useEffect(() => {
    dispatch(fetchJobCategories());
    dispatch(fetchJobSkills());
    dispatch(fetchJobs());
  }, [dispatch, isFormVisible, openDialog]);

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

  const handleSkillChange = (e) => {
    const { value } = e.target;
    const updatedSkills = skills.filter(skill => value.includes(skill.id));

    setJobData({
      ...jobData,
      skills_required: updatedSkills,
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

    if (jobData.id) {
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
      skills_required: [],
      status: 'open', // Reset status to default
    });
  };

  const handleEdit = (job) => {
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
      skills_required: job.skills_required,
      status: job.status, // Include status during edit
    });
    setIsFormVisible(true);
  };

  const handleDelete = (jobId) => {
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

  const handleAddSkill = () => {
    if (newSkill.trim() === '') {
      setError('Skill name cannot be empty');
      return;
    }

    dispatch(addSkill({ name: newSkill }))
      .unwrap()
      .then(() => {
        setOpenDialog(false);
        setNewSkill('');
      })
      .catch((err) => setError(err.message || 'An error occurred while adding the skill.'));
  };

  const handleViewApplicants = (jobId) => {
    navigate(`/EmployerJobapplicants/${jobId}`);
  };

  // Toggle job status
  const handleToggleStatus = (jobId, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';

    const jobToUpdate = jobs.find(job => job.id === jobId);

    if (!jobToUpdate) {
      setError('Job not found.');
      return;
    }

    const jobDataToUpdate = {
      ...jobToUpdate,
      status: newStatus,
    };

    dispatch(updateJob({ jobId, jobData: jobDataToUpdate }))
      .unwrap()
      .then(() => {
      })
      .catch((err) => setError(err.message || 'An error occurred while updating the job status.'));
  };

  const filteredJobs = jobs.filter((job) => job.employer == userid);

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
    <ThemeProvider theme={theme}>
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
            <Button variant="contained" color="secondary" onClick={() => setOpenDialog(true)} sx={{ ml: 1 }}>
              Add Skill
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
              <FormControl fullWidth margin="normal">
                <InputLabel>Employment Type</InputLabel>
                <Select
                  name="employment_type"
                  value={jobData.employment_type}
                  onChange={handleChange}
                  required
                >
                  {EMPLOYMENT_TYPE_CHOICES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                control={<Checkbox checked={jobData.is_remote} onChange={handleChange} name="is_remote" />}
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
              <FormControl fullWidth margin="normal">
                <InputLabel>Experience Level</InputLabel>
                <Select
                  name="experience_level"
                  value={jobData.experience_level}
                  onChange={handleChange}
                  required
                >
                  {EXPERIENCE_LEVEL_CHOICES.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      {level.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  value={jobData.categories.map((cat) => cat.category)}
                  onChange={handleCategoryChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <ListItemText primary={category.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Required Skills</InputLabel>
                <Select
                  multiple
                  value={jobData.skills_required.map((skill) => skill.id)}
                  onChange={handleSkillChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={skills.find(skill => skill.id === value)?.name} />
                      ))}
                    </Box>
                  )}
                >
                  {skills.map((skill) => (
                    <MenuItem key={skill.id} value={skill.id}>
                      <ListItemText primary={skill.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                {jobData.id ? 'Update Job' : 'Create Job'}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setIsFormVisible(false)}
                sx={{ ml: 1, mt: 2 }}
              >
                Cancel
              </Button>
            </Box>
          )}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Job Listings
            </Typography>
            {filteredJobs.length === 0 ? (
              <Typography>No jobs available</Typography>
            ) : (
              filteredJobs.map((job) => (
                <Box key={job.id} sx={{ mb: 2, border: '1px solid #ddd', borderRadius: 1, p: 2 }}>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2">{job.description}</Typography>
                  <Typography variant="body2">Status: {job.status}</Typography>
                  <Button 
                    variant="contained" 
                    color="info" 
                    onClick={() => handleToggleStatus(job.id, job.status)} 
                    sx={{ mr: 1 }}
                  >
                    {job.status === 'open' ? 'Close Job' : 'Open Job'}
                  </Button>
                  <Box sx={{ mt: 1 }}>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(job)} sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleDelete(job.id)} sx={{ mr: 1 }}>
                      Delete
                    </Button>
                    <Button variant="contained" color="info" onClick={() => handleViewApplicants(job.id)}>
                      View Applicants
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => handleViewJob(job)}>
                      View Job
                    </Button>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Paper>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Add Category or Skill</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter the name of the new category or skill.
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
            <TextField
              margin="dense"
              label="Skill Name"
              type="text"
              fullWidth
              variant="standard"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
            <Button onClick={handleAddSkill}>Add Skill</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
          <DialogTitle>View Job</DialogTitle>
          <DialogContent>
            {selectedJob && (
              <>
                <Typography variant="h6">{selectedJob.title}</Typography>
                <Typography variant="body2">{selectedJob.description}</Typography>
                <Typography variant="body2">Responsibilities: {selectedJob.responsibilities}</Typography>
                <Typography variant="body2">Qualifications: {selectedJob.qualifications}</Typography>
                <Typography variant="body2">Nice to Have: {selectedJob.nice_to_have}</Typography>
                <Typography variant="body2">Employment Type: {selectedJob.employment_type}</Typography>
                <Typography variant="body2">Location: {selectedJob.location}</Typography>
                <Typography variant="body2">Salary: {selectedJob.salary_min} - {selectedJob.salary_max}</Typography>
                <Typography variant="body2">Remote: {selectedJob.is_remote ? 'Yes' : 'No'}</Typography>
                <Typography variant="body2">Application Deadline: {selectedJob.application_deadline}</Typography>
                <Typography variant="body2">Experience Level: {selectedJob.experience_level}</Typography>
                <Typography variant="body2">Job Function: {selectedJob.job_function}</Typography>
                <Typography variant="body2">Categories: {selectedJob.categories.map(cat => cat.category).join(', ')}</Typography>
                <Typography variant="body2">Required Skills: {selectedJob.skills_required.map(skill => skill.name).join(', ')}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
};

export default JobManagement;