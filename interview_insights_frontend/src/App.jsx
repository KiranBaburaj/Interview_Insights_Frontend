// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Employerjobs from './pages/Employer/Employerjobs';


const App = () => {
  return (
    <Router>
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
        /><Route path="EmployerCompanyManagement" element={<EmployerCompanyManagement />} />
        <Route path="EmployerJobManagement" element={<Employerjobs/>} />

        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
