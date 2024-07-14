import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'job_seeker',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignupAndSendOTP = async (e) => {
    e.preventDefault();

    const { email, password, full_name, role } = formData;

    // Validate form data
    if (!email || !password || !full_name || !role) {
      alert('All fields are required');
      return;
    }

    // Structure data for API request
    const data = {
      user: { email, password, full_name },
      role,
    };

    // Dispatch action to send OTP
    try {
      await dispatch(signup(data)).unwrap();
      // Navigate to verify OTP page after successfully dispatching OTP
      navigate('/verify-otp');
    } catch (error) {
      // Handle any errors here
      console.error('Failed to send OTP:', error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignupAndSendOTP}>
        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="job_seeker">Job Seeker</option>
          <option value="employer">Employer</option>
          <option value="recruiter">Recruiter</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Sign Up and Send OTP'}
        </button>
      </form>
      {error && <p>{JSON.stringify(error)}</p>}
    </div>
  );
};

export default SignupForm;