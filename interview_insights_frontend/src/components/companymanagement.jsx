import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies, createCompany, updateCompany } from '../features/company/companySlice';
import { 
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  CircularProgress
} from '@mui/material';

const CompanyManagement = () => {
  const dispatch = useDispatch();
  const { companies, status, error } = useSelector(state => state.company);
  const { user } = useSelector(state => state.auth); 
  const [companyData, setCompanyData] = useState({
    name: '',
    logo_url: '',
    website_url: '',
    industry: '',
    company_size: '',
    founded_date: '',
    description: '',
    headquarters_location: '',
    employee_count: '',
    tech_stack: '',
    gst_document: null,
    is_approved: false,
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [companyExists, setCompanyExists] = useState(false);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (companies.length > 0) {
      // Check if the logged-in user already has a company
      const userCompany = companies.find(company => company.employer === user.id);
      if (userCompany) {
        setCompanyExists(true);
        setCompanyData(userCompany); // Set company data if a company exists
      }
    }
  }, [companies, user.id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
  
    // Handle file inputs
    if (type === 'file') {
      setCompanyData({
        ...companyData,
        [name]: files[0], // Assuming single file upload, use files[0]
      });
    } else {
      setCompanyData({
        ...companyData,
        [name]: value,
      });
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const companyData2 = {
      ...companyData,
      employer: user.id,
    };
    if (companyData.id) {
      // If companyData has an id, it means we are updating an existing company
      dispatch(updateCompany(companyData2));
    } else {
      // Otherwise, we are creating a new company
      dispatch(createCompany(companyData2));
    }
    // Optionally, you can reset the form after submission
    resetForm();
  };

  const resetForm = () => {
    setCompanyData({
      name: '',
      logo_url: '',
      website_url: '',
      industry: '',
      company_size: '',
      founded_date: '',
      description: '',
      headquarters_location: '',
      employee_count: '',
      tech_stack: '',
      gst_document: null,
      is_approved: false,
    });
    setIsFormVisible(false); // Hide the form after submission
  };

  const handleEdit = (company) => {
    // Set companyData to the selected company for editing
    setCompanyData(company);
    setIsFormVisible(true); // Show the form when editing
  };

  const handleDelete = (companyId) => {
    // Dispatch an action to delete the company
    // You may want to confirm before deletion in a real-world application
    // Example: if (window.confirm('Are you sure you want to delete?')) { dispatch(deleteCompany(companyId)); }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Company Management
          </Typography>
          {!companyExists && !isFormVisible && (
            <Button variant="contained" color="primary" onClick={() => setIsFormVisible(true)}>
              Create Company
            </Button>
          )}
          {(isFormVisible || !companyExists) && (
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <TextField
                fullWidth
                margin="normal"
                id="name"
                name="name"
                label="Company Name"
                variant="outlined"
                value={companyData.name}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                id="logo_url"
                name="logo_url"
                label="Logo URL"
                variant="outlined"
                value={companyData.logo_url}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                id="website_url"
                name="website_url"
                label="Website URL"
                variant="outlined"
                value={companyData.website_url}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                id="industry"
                name="industry"
                label="Industry"
                variant="outlined"
                value={companyData.industry}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                id="company_size"
                name="company_size"
                label="Company Size"
                variant="outlined"
                value={companyData.company_size}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                id="founded_date"
                name="founded_date"
                label="Founded Date"
                type="date"
                variant="outlined"
                value={companyData.founded_date}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                variant="outlined"
                value={companyData.description}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                id="headquarters_location"
                name="headquarters_location"
                label="Headquarters Location"
                variant="outlined"
                value={companyData.headquarters_location}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                id="employee_count"
                name="employee_count"
                label="Employee Count"
                type="number"
                variant="outlined"
                value={companyData.employee_count}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                margin="normal"
                id="tech_stack"
                name="tech_stack"
                label="Tech Stack"
                variant="outlined"
                value={companyData.tech_stack}
                onChange={handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
              >
                {companyData.id ? 'Update Company' : 'Add Company'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                sx={{ mt: 2, ml: 2 }}
                onClick={resetForm}
              >
                Cancel
              </Button>
            </form>
          )}
          {status === 'loading' && <CircularProgress sx={{ mt: 2 }} />}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {typeof error === 'object' ? JSON.stringify(error) : error}
            </Typography>
          )}
          {companyExists && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>
                Existing Company
              </Typography>
              <ul>
                {companies
                  .filter(company => company.employer === user.id)
                  .map(company => (
                    <li key={company.id}>
                      {company.name}
                      <Button variant="outlined" color="primary" onClick={() => handleEdit(company)} sx={{ mx: 1 }}>
                        Edit
                      </Button>
                      <Button variant="outlined" color="error" onClick={() => handleDelete(company.id)} sx={{ mx: 1 }}>
                        Delete
                      </Button>
                    </li>
                  ))}
              </ul>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default CompanyManagement;
