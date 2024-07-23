import React from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const CompanyList = () => {
  const { companies, status, error } = useSelector(state => state.company);

  // Check if companies is an array before rendering
  if (!Array.isArray(companies)) {
    return <Typography>Error: Companies data is not an array.</Typography>;
  }

  return (
    <Box>
      {status === 'loading' && <Typography>Loading...</Typography>}
      {error && <Typography>Error: {error}</Typography>}
      {status === 'succeeded' && (
        companies.map(company => (
          <Box key={company.id}>
            <Typography variant="h6">{company.name}</Typography>
            <Typography>{company.description}</Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

const AdminCompany = () => {
  return (
    <Box>
      <Typography variant="h4">Company Management</Typography>
      <CompanyList />
    </Box>
  );
};

export default AdminCompany;
