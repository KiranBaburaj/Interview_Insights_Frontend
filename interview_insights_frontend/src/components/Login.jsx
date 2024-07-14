import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError,setUser  } from '../features/auth/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, role } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData)).then((result) => {
      if (result.payload) {
        // Dispatch setUser action to store user details in Redux
        dispatch(setUser(result.payload));
      }
    });
  };


  useEffect(() => {
    if (role) {
      if (role === 'jobseeker') {
        navigate('/dashboard/jobseeker');
      } else if (role === 'employer') {
        navigate('/dashboard/employer');
      } else if (role === 'recruiter') {
        navigate('/dashboard/recruiter');
      }
    }
  }, [role, navigate]);

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      {error && <p>{JSON.stringify(error)}</p>}
    </div>
  );
};

export default Login;
