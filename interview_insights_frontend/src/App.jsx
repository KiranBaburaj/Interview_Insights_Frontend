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
import Employerjobs from './pages/Employer/Employerjobs';
import JobSeekerList from './components/JobSeekerList';
import AdminJobSeeker from './pages/Admin/AdminJobseeker';
import AdminEmployersManagement from './pages/Admin/AdminEmployersManagement';
import AdminCompany from './pages/Admin/Admincompany';
import CompanyList from './components/Admincompany';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/adminlogin" element={<AdminLogin />} />
      <Route path="/admindashboard" element={<AdminDashboard />} />
      <Route path="/jobseekers" element={<AdminJobSeeker/>} />
      <Route path="/Employers" element={<AdminEmployersManagement/>} />
      <Route path="/companies" element={<AdminCompany/>} />
      <Route
        path="/dashboard/jobseeker"
        element={
          <ProtectedRoute roleRequired="jobseeker">
            <JobseekerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/employer"
        element={
          <ProtectedRoute roleRequired="employer">
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
          <ProtectedRoute roleRequired="employer">
            <Employerjobs />
          </ProtectedRoute>
        }
      />
      {/* Add other routes here */}
      {/* 404 Not Found Route */}
    </Routes>
  );
};

export default App;
