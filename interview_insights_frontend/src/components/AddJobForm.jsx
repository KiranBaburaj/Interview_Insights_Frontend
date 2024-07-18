import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addJob } from '../features/jobs/jobsSlice';
import { fetchJobCategories, selectAllCategories, addCategory } from '../features/jobCategories/jobCategoriesSlice';
import {
  TextField,
  Checkbox,
  FormControlLabel,
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
  DialogTitle
} from '@mui/material';

const AddJobForm = () => {
  const dispatch = useDispatch();
  const [jobData, setJobData] = useState({
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

  const categories = useSelector(selectAllCategories);
  const categoriesStatus = useSelector((state) => state.jobCategories.status);
  const categoriesError = useSelector((state) => state.jobCategories.error);

  useEffect(() => {
    if (categoriesStatus === 'idle') {
      dispatch(fetchJobCategories());
    }
  }, [categoriesStatus, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJobData({
      ...jobData, 
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setJobData({
      ...jobData,
      categories: value,
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
      category_ids: jobData.categories,
    };

    console.log('Submitting job data:', jobDataToSend);

    dispatch(addJob(jobDataToSend))
      .unwrap()
      .then(() => {
        // Reset form fields after successful submission
        setJobData({
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
      })
      .catch((err) => {
        setError(err.message || 'An error occurred while adding the job.');
      });
  };
  
  const handleAddCategory = () => {
    dispatch(addCategory({ name: newCategory }));
    setOpenDialog(false);
    setNewCategory('');
  };

  if (categoriesStatus === 'loading') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (categoriesStatus === 'failed') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Error: {categoriesError}</Typography>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>
      <Typography variant="h4" gutterBottom>
        Add Job
      </Typography>
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
        InputLabelProps={{
          shrink: true,
        }}
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
          name="categories"
          multiple
          value={jobData.categories.map(cat => cat.id)}
          onChange={handleCategoryChange}
          renderValue={(selected) => {
            const selectedCategories = categories.filter(cat => selected.includes(cat.id));
            return selectedCategories.map(cat => cat.name).join(', ');
          }}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        <Button onClick={() => setOpenDialog(true)} sx={{ mt: 2 }}>
          Add New Category
        </Button>
      </FormControl>
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        Add Job
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of the new category.
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
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddCategory}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddJobForm;
