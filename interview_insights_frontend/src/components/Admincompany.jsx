import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies, addCompany, updateCompany, deleteCompany, toggleCompanyApproval } from '../features/company/companySlice';
import { Box, Typography, Button, List, ListItem, ListItemText, TextField } from '@mui/material';

const CompanyList = () => {
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.company.companies);
  const status = useSelector((state) => state.company);
  const error = useSelector((state) => state.company);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({ name: '', is_approved: false });

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      dispatch(deleteCompany(id));
    }
  };

  const handleEditClick = (company) => {
    setEditingCompany(company.id);
    setFormData({ name: company.name, is_approved: company.is_approved });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'is_approved' ? e.target.checked : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingCompany) {
      dispatch(updateCompany({ id: editingCompany, data: formData }));
      setEditingCompany(null);
      setFormData({ name: '', is_approved: false });
    } else {
      dispatch(addCompany(formData));
      setFormData({ name: '', is_approved: false });
    }
  };

  const handleToggleApproval = (id) => {
    dispatch(toggleCompanyApproval(id));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Companies</Typography>
      <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
        <TextField
          name="name"
          label="Company Name"
          value={formData.name}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          sx={{ flex: 1 }}
        />
        <Button type="submit" variant="contained" color="primary">
          {editingCompany ? 'Save' : 'Create'}
        </Button>
        {editingCompany && (
          <Button onClick={() => setEditingCompany(null)} variant="outlined" color="secondary">
            Cancel
          </Button>
        )}
      </Box>
      <List>
        {companies.map((company) => (
          <ListItem key={company.id} sx={{ borderBottom: '1px solid #ccc' }}>
            {editingCompany === company.id ? (
              <Box component="form" onSubmit={handleFormSubmit} sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
                <TextField
                  name="name"
                  label="Company Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1 }}
                />
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
                <Button onClick={() => setEditingCompany(null)} variant="outlined" color="secondary">
                  Cancel
                </Button>
              </Box>
            ) : (
              <>
                <ListItemText
                  primary={`${company.name}`}
                  secondary={`Status: ${company.is_approved ? 'Approved' : 'Not Approved'}`}
                  sx={{ flex: '1 1 auto' }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button onClick={() => handleEditClick(company)} variant="outlined" color="secondary">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(company.id)} variant="outlined" color="error">
                    Delete
                  </Button>
                  <Button onClick={() => handleToggleApproval(company.id)} variant="outlined" color="warning">
                    {company.is_approved ? 'Disapprove' : 'Approve'}
                  </Button>
                </Box>
              </>
            )}
          </ListItem>
        ))}
      </List>
      {status === 'loading' && <Typography>Loading...</Typography>}
      {error && <Typography color="error">Error loading companies: {error}</Typography>}
    </Box>
  );
};

export default CompanyList;
