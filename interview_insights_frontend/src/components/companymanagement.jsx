import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies, createCompany, updateCompany } from '../features/company/companySlice';

const CompanyManagement = () => {
  const dispatch = useDispatch();
  const { companies, status, error } = useSelector(state => state.company);
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

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

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
    if (companyData.id) {
      // If companyData has an id, it means we are updating an existing company
      dispatch(updateCompany(companyData));
    } else {
      // Otherwise, we are creating a new company
      dispatch(createCompany(companyData));
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
  };

  const handleEdit = (company) => {
    // Set companyData to the selected company for editing
    setCompanyData(company);
  };

  const handleDelete = (companyId) => {
    // Dispatch an action to delete the company
    // You may want to confirm before deletion in a real-world application
    // Example: if (window.confirm('Are you sure you want to delete?')) { dispatch(deleteCompany(companyId)); }
  };

  return (
    <div>
      <h2>Company Management</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" value={companyData.name} onChange={handleChange} placeholder="Company Name" required />
        <input type="text" name="logo_url" value={companyData.logo_url} onChange={handleChange} placeholder="Logo URL" />
        <input type="text" name="website_url" value={companyData.website_url} onChange={handleChange} placeholder="Website URL" />
        <input type="text" name="industry" value={companyData.industry} onChange={handleChange} placeholder="Industry" />
        <input type="text" name="company_size" value={companyData.company_size} onChange={handleChange} placeholder="Company Size" />
        <input type="date" name="founded_date" value={companyData.founded_date} onChange={handleChange} placeholder="Founded Date" />
        <textarea name="description" value={companyData.description} onChange={handleChange} placeholder="Description"></textarea>
        <input type="text" name="headquarters_location" value={companyData.headquarters_location} onChange={handleChange} placeholder="Headquarters Location" />
        <input type="number" name="employee_count" value={companyData.employee_count} onChange={handleChange} placeholder="Employee Count" />
        <input type="text" name="tech_stack" value={companyData.tech_stack} onChange={handleChange} placeholder="Tech Stack" />
       
        <button type="submit">{companyData.id ? 'Update Company' : 'Add Company'}</button>
      </form>
      {status === 'loading' && <p>Loading...</p>}
      {error && <p>{typeof error === 'object' ? JSON.stringify(error) : error}</p>}
      <ul>
        {companies.map(company => (
          <li key={company.id}>
            {company.name}
            <button onClick={() => handleEdit(company)}>Edit</button>
            <button onClick={() => handleDelete(company.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompanyManagement;
