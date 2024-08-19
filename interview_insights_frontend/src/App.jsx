import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const VerifyOTP = lazy(() => import('./pages/Verifyotp'));
const JobseekerDashboard = lazy(() => import('./pages/Jobseeker/JobseekerDashboard'));
const EmployerDashboard = lazy(() => import('./pages/Employer/EmployerDashboard'));
const AdminLogin = lazy(() => import('./pages/Admin/Adminlogin'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const ForgotPassword = lazy(() => import('./pages/Fogotpassword'));
const Home = lazy(() => import('./pages/Home'));
const EmployerCompanyManagement = lazy(() => import('./pages/Employer/EmployerCompanyManagement'));
const EmployerJobs = lazy(() => import('./pages/Employer/Employerjobs'));
const AdminJobSeeker = lazy(() => import('./pages/Admin/AdminJobseeker'));
const AdminEmployersManagement = lazy(() => import('./pages/Admin/AdminEmployersManagement'));
const AdminCompany = lazy(() => import('./pages/Admin/Admincompany'));
const JobDetails = lazy(() => import('./components/JobDetails'));
const ApplicantsList = lazy(() => import('./components/Employer/ApplicantsList'));
const Chat = lazy(() => import('./components/Chat'));
const ChatRoom = lazy(() => import('./components/ChatRoom'));
const JobseekerProfile = lazy(() => import('./pages/Jobseeker/JobseekerProfile'));
const JobseekerJobs = lazy(() => import('./pages/Jobseeker/JobseekerJobs'));
const InterviewScheduler = lazy(() => import('./components/Employer/InterviewScheduler'));
const InterviewFeedbackForm = lazy(() => import('./components/Employer/InterviewFeedbackForm'));
const MyComponent = lazy(() => import('./MyComponent')); // Lazy load MyComponent

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/my-component" element={<MyComponent />} />
        {/* Protected Admin Routes */}
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
        {/* Jobseeker Routes */}
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
              <JobseekerProfile />
            </ProtectedRoute>
          }
        />
        {/* Employer Routes */}
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
        {/* Chat Routes */}
        <Route path="/chat" element={<ProtectedRoute roleRequired="jobseeker"><Chat /></ProtectedRoute>} />
        <Route path="/chat/:roomId" element={<ProtectedRoute roleRequired="jobseeker"><ChatRoom /></ProtectedRoute>} />
        <Route path="/employer/chat" element={<ProtectedRoute roleRequired="employer" checkCompanyDetails={true}><Chat /></ProtectedRoute>} />
        <Route path="/employer/chat/:roomId" element={<ProtectedRoute roleRequired="employer" checkCompanyDetails={true}><ChatRoom /></ProtectedRoute>} />
        {/* Job Details Route */}
        <Route path="/job/:jobId" element={<JobDetails />} />
        {/* Add other routes here */}
      </Routes>
    </Suspense>
  );
};

export default App;