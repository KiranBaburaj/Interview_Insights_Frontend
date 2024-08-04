import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicants, updateApplicantStatus } from '../../features/applicants/applicantsSlice';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Avatar,
  Select,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useNavigate, useParams } from 'react-router-dom';

const ApplicantsList = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const applicants = useSelector((state) => state.applicants.applicants);
  const status = useSelector((state) => state.applicants.status);
  const error = useSelector((state) => state.applicants.error);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchApplicants(jobId));
  }, [dispatch, jobId]);

  const handleStatusChange = (applicantId, newStatus) => {
    dispatch(updateApplicantStatus({ applicantId, status: newStatus })).then(() => {
      dispatch(fetchApplicants(jobId)); // Re-fetch applicants to get the updated status
    });
  };

  const handleDownloadResume = (resumeUrl) => {
    window.open(`http://localhost:8000${resumeUrl}`, '_blank');
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
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Total Applicants: {applicants.length}</Typography>
            <Box>
              <TextField
                placeholder="Search Applicants"
                variant="outlined"
                size="small"
                sx={{ mr: 2 }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon />
                  ),
                }}
              />
              <IconButton>
                <FilterListIcon />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Hiring Stage</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={`http://localhost:8000${applicant.job_seeker.profile_photo}`}
                          alt={applicant.job_seeker.user.full_name}
                          sx={{ mr: 2, width: 40, height: 40 }}
                        />
                        {applicant.job_seeker.user.full_name}
                      </Box>
                    </TableCell>
                    <TableCell>{applicant.job_seeker.user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={applicant.status || 'N/A'}
                        onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                      >
                        <MenuItem value="applied">Applied</MenuItem>
                        <MenuItem value="reviewed">Reviewed</MenuItem>
                        <MenuItem value="interviewed">Interviewed</MenuItem>
                        <MenuItem value="hired">Hired</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>{new Date(applicant.applied_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleDownloadResume(applicant.resume)}
                      >
                        See Application
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/schedule-interview/${applicant.id}`)}
                      >
                        Schedule Interview
                      </Button>
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ApplicantsList;
