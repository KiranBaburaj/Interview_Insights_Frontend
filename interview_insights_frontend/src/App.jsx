import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyOTP from './pages/Verifyotp';
import JobseekerDashboard from './pages/Jobseeker/JobseekerDashboard';
import EmployerDashboard from './pages/Employer/EmployerDashboard';
import AdminLogin from './pages/Admin/Adminlogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ForgotPassword from './pages/Fogotpassword';
import Home from './pages/Home';
import Logout from './components/Logout';
import ProtectedRoute from './components/ProtectedRoute';
import EmployerCompanyManagement from './pages/Employer/EmployerCompanyManagement';
import EmployerJobs from './pages/Employer/Employerjobs'; // Corrected component import name
import JobSeekerList from './components/JobSeekerList';
import AdminJobSeeker from './pages/Admin/AdminJobseeker';
import AdminEmployersManagement from './pages/Admin/AdminEmployersManagement';
import AdminCompany from './pages/Admin/Admincompany';
import CompanyList from './components/Admincompany';
import JobDetails from './components/JobDetails';
import ApplicantsList from './components/Employer/ApplicantsList';



import JobseekerProfile from './pages/Jobseeker/JobseekerProfile';
import JobseekerJobs from './pages/Jobseeker/JobseekerJobs';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/adminlogin" element={<AdminLogin />} />

      <Route
        path="/admindashboard"
        element={
          <ProtectedRoute roleRequired="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobseekers"
        element={
          <ProtectedRoute roleRequired="admin">
            <AdminJobSeeker />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/employers"
        element={
          <ProtectedRoute roleRequired="admin">
            <AdminEmployersManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/companies"
        element={
          <ProtectedRoute roleRequired="admin">
            <AdminCompany />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/jobseeker"
        element={
          <ProtectedRoute roleRequired="jobseeker">
            <JobseekerDashboard />
          </ProtectedRoute>
        }
      />
<Route
        path="/jobseekerapplications"
        element={
          <ProtectedRoute roleRequired="jobseeker">
            <JobseekerJobs />
          </ProtectedRoute>
        }
      />
<Route
        path="/jobseekerprofile"
        element={
          <ProtectedRoute roleRequired="jobseeker">
            <JobseekerProfile/>
          </ProtectedRoute>
        }
      />


      <Route
        path="/dashboard/employer"
        element={
          <ProtectedRoute roleRequired="employer" checkCompanyDetails={true}>
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/EmployerCompanyManagement"
        element={
          <ProtectedRoute roleRequired="employer">
            <EmployerCompanyManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/EmployerJobManagement"
        element={
          <ProtectedRoute roleRequired="employer" checkCompanyDetails={true}>
            <EmployerJobs />
          </ProtectedRoute>
        }
      />
         <Route
        path="/EmployerJobapplicants/:jobId"
        element={
          <ProtectedRoute roleRequired="employer" checkCompanyDetails={true}>
            <ApplicantsList />
          </ProtectedRoute>
        }
      />
        <Route
        path="/job/:jobId"
        element={<JobDetails />}
      />
      {/* Add other routes here */}
      {/* 404 Not Found Route */}
    </Routes>
  );
};

export default App;
