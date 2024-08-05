// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/'; // Change this to your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// User API endpoints
export const getUsers = () => api.get('users/', { headers: getAuthHeader() });
export const getUser = (id) => api.get(`users/${id}/`, { headers: getAuthHeader() });
export const createUser = (data) => api.post('users/', data, { headers: getAuthHeader() });
export const updateUser = (id, data) => api.put(`users/${id}/`, data, { headers: getAuthHeader() });
export const deleteUser = (id) => api.delete(`users/${id}/`, { headers: getAuthHeader() });

// JobSeeker API endpoints
export const getJobSeekers = () => api.get('jobseekers/');
export const getJobSeeker = (id) => api.get(`jobseekers/${id}/`);
export const createJobSeeker = (data) => api.post('jobseekers/', data);
export const updateJobSeeker = (id, data) => api.put(`jobseekers/${id}/`, data);
export const deleteJobSeeker = (id) => api.delete(`jobseekers/${id}/`);

// Employer API endpoints
export const getEmployers = () => api.get('employers/', { headers: getAuthHeader() });
export const getEmployer = (id) => api.get(`employers/${id}/`, { headers: getAuthHeader() });
export const createEmployer = (data) => api.post('employers/', data, { headers: getAuthHeader() });
export const updateEmployer = (id, data) => api.put(`employers/${id}/`, data, { headers: getAuthHeader() });
export const deleteEmployer = (id) => api.delete(`employers/${id}/`, { headers: getAuthHeader() });
