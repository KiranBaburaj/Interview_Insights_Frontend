// src/components/MyApplications.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications } from '../../features/applications/applicationsSlice';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Grid,
  Button,
  TextField,
  Alert,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useState } from 'react';

const MyApplications = () => {
  const dispatch = useDispatch();
  const applications = useSelector((state) => state.myapplications.applications);
  const status = useSelector((state) => state.myapplications.status);
  const error = useSelector((state) => state.myapplications.error);

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (status === 'loading') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4">My Applications</Typography>
      <Typography variant="subtitle1">Keep it up, Jake</Typography>
      <Typography variant="body2">
        Here is job applications status from July 19 - July 25.
      </Typography>
      <Card sx={{ mt: 2, mb: 2 }}>
        <CardContent>
          <Typography variant="body2" color="textSecondary">
            New Feature
          </Typography>
          <Typography variant="body1">
            You can request a follow-up 7 days after applying for a job if the
            application status is in review. Only one follow-up is allowed per
            job.
          </Typography>
        </CardContent>
      </Card>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All (45)" />
          <Tab label="In Review (34)" />
          <Tab label="Interviewing (18)" />
          <Tab label="Assessment (5)" />
          <Tab label="Offered (2)" />
          <Tab label="Hired (1)" />
        </Tabs>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
        <TextField
          placeholder="Search Applicants"
          variant="outlined"
          size="small"
          sx={{ mr: 2 }}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
        />
        <IconButton>
          <FilterListIcon />
        </IconButton>
      </Box>
      <Divider />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Date Applied</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application, index) => (
              <TableRow key={application.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={application.companyLogoUrl}
                      alt={application.companyName}
                      sx={{ mr: 2 }}
                    />
                    {application.companyName}
                  </Box>
                </TableCell>
                <TableCell>{application.jobRole}</TableCell>
                <TableCell>
                  {new Date(application.dateApplied).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip label={application.status} />
                </TableCell>
                <TableCell>
                  <Button variant="outlined">See Application</Button>
                </TableCell>
                <TableCell>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MyApplications;
