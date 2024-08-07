import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications } from '../../features/applications/applicationsSlice';
import { fetchInterviews } from '../../features/interview/interviewSlice';
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

const MyApplications = () => {
  const dispatch = useDispatch();
  const applications = useSelector((state) => state.myapplications.applications);
  const applicationsStatus = useSelector((state) => state.myapplications.status);
  const applicationsError = useSelector((state) => state.myapplications.error);

  const interviews = useSelector((state) => state.interviews.interviews);
  const interviewsStatus = useSelector((state) => state.interviews.status);
  const interviewsError = useSelector((state) => state.interviews.error);

  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    dispatch(fetchApplications());
    dispatch(fetchInterviews());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (applicationsStatus === 'loading' || interviewsStatus === 'loading') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (applicationsStatus === 'failed') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Error: {applicationsError}</Typography>
      </Box>
    );
  }

  if (interviewsStatus === 'failed') {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">Error: {interviewsError}</Typography>
      </Box>
    );
  }

  const getInterviewForApplication = (applicationId) => {
    return interviews.find(interview => interview.job_application === applicationId);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4">My Applications</Typography>
      <Card sx={{ mt: 2, mb: 2 }}>
        <CardContent>
          {/* Additional content can go here */}
        </CardContent>
      </Card>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All " />
          <Tab label="In Review " />
          <Tab label="Interviewing " />
          <Tab label="Assessment " />
          <Tab label="Offered " />
          <Tab label="Hired " />
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
              <TableCell>Interview</TableCell>
              <TableCell>Action</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application, index) => {
              const interview = getInterviewForApplication(application.id);
              return (
                <TableRow key={application.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={application.job_details.company.logoUrl} // Adjust if you have a logo URL
                        alt={application.job_details.company.name}
                        sx={{ mr: 2 }}
                      />
                      {application.job_details.company.name}
                    </Box>
                  </TableCell>
                  <TableCell>{application.job_details.title}</TableCell>
                  <TableCell>
                    {new Date(application.applied_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip label={application.status} />
                  </TableCell>
                  <TableCell>
                    {interview ? (
                      <Box>
                        <Typography variant="body2">
                          {new Date(interview.scheduled_time).toLocaleDateString()} at {new Date(interview.scheduled_time).toLocaleTimeString()}
                        </Typography>
                        <Typography variant="body2">{interview.location}</Typography>
                      </Box>
                    ) : (
                      'No Interview Scheduled'
                    )}
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
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default MyApplications;
