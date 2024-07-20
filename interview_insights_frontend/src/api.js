// src/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/'; // Change this to your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getUsers = () => api.get('users/', { headers: getAuthHeader() });
export const getUser = (id) => api.get(`users/${id}/`, { headers: getAuthHeader() });
export const createUser = (data) => api.post('users/', data, { headers: getAuthHeader() });
export const updateUser = (id, data) => api.put(`users/${id}/`, data, { headers: getAuthHeader() });
export const deleteUser = (id) => api.delete(`users/${id}/`, { headers: getAuthHeader() });
