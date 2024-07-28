// src/components/ApplicantsList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplicants } from '../../features/applicants/applicantsSlice';
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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useParams } from 'react-router-dom';

const ApplicantsList = () => {

    const { jobId } = useParams();
  const dispatch = useDispatch();
  const applicants = useSelector((state) => state.applicants.applicants);
  
  const status = useSelector((state) => state.applicants.status);
  const error = useSelector((state) => state.applicants.error);

  useEffect(() => {
    dispatch(fetchApplicants(jobId));
  }, [dispatch, jobId]);

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
                  <TableCell>Score</TableCell>
                  <TableCell>Hiring Stage</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Job Role</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar src={applicant.avatarUrl} alt={applicant.name} sx={{ mr: 2 }} />
                        {applicant.name}
                      </Box>
                    </TableCell>
                    <TableCell>{applicant.score}</TableCell>
                    <TableCell>
                      <Chip label={applicant.hiringStage} />
                    </TableCell>
                    <TableCell>{new Date(applicant.appliedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{applicant.jobRole}</TableCell>
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
        </CardContent>
      </Card>
    </Container>
  );
};

export default ApplicantsList;
