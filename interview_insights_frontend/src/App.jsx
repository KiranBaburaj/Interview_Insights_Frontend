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
    <Suspense fallback={<MyComponent />}>
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
  path="/jobseekerprofile/:id"
  element={
    <ProtectedRoute roleRequired="employer">
      <JobseekerProfile />
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
  path="/chat"
  element={
    <ProtectedRoute roleRequired="jobseeker">
      <Chat />
    </ProtectedRoute>
  }
/>

<Route
  path="/chat/:roomId"
  element={
    <ProtectedRoute roleRequired="jobseeker">
      <ChatRoom />
    </ProtectedRoute>
  }
/>

<Route
  path="/employer/chat"
  element={
    <ProtectedRoute roleRequired="employer" checkCompanyDetails={true}>
      <Chat />
    </ProtectedRoute>
  }
/>

<Route
  path="/employer/chat/:roomId"
  element={
    <ProtectedRoute roleRequired="employer" checkCompanyDetails={true}>
      <ChatRoom />
    </ProtectedRoute>
  }
/>
<Route
  path="/chat/:jobseekerId/:employerId"
  element={
    <ProtectedRoute roleRequired={["jobseeker", "employer"]}>
      <ChatRoom />
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
        path="/schedule-interview/:applicantId"
        element={
          <ProtectedRoute roleRequired="employer" checkCompanyDetails={true}>
            <InterviewScheduler />
          </ProtectedRoute>
        }
      />

<Route
        path="/interview-feedback/:interviewId"
        element={
          <ProtectedRoute roleRequired="employer">
            <InterviewFeedbackForm />
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
    </Suspense>
  );
};

export default App;