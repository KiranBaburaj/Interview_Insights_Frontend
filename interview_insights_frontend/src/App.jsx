import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyOTP from './pages/Verifyotp';
import JobseekerDashboard from './pages/Jobseeker/JobseekerDashboard';
import EmployerDashboard from './pages/Employer/EmployerDashboard';
import { useSelector } from 'react-redux';
import AdminLogin from './pages/Admin/Adminlogin';
import AdminDashboard from './pages/Admin/AdminDashboard';

const App = () => {
  const { role } = useSelector((state) => state.auth);
  return (
    <Router>
      <Routes>

        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />


        {role && (
          <>
            <Route path="/dashboard/jobseeker" element={<JobseekerDashboard />} />
            <Route path="/dashboard/employer" element={<EmployerDashboard />} />
            
          </>  )}
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;