// axiosAdmin.js

import axios from 'axios';

const axiosAdmin = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',  // Adjust baseURL as per your API endpoint
  withCredentials: true,  // Enable if you need to send cookies or authentication headers with cross-origin requests
});

// Request interceptor to add Authorization header with JWT token
axiosAdmin.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('adminAccessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401 Unauthorized and token refreshing
axiosAdmin.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('adminRefreshToken');
    
    // If the error status is 401 and there's a refresh token available
    if (error.response.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;  // Prevent infinite loop

      try {
        // Request new access token using refresh token
        const response = await axiosAdmin.post('/token/refresh/', { refresh: refreshToken });
        const newAccessToken = response.data.access;

        // Update local storage with new access token
        localStorage.setItem('adminAccessToken', newAccessToken);
        
        // Update original request headers with new access token and retry original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosAdmin(originalRequest);
      } catch (error) {
        // Handle refresh token failure (e.g., clear tokens and redirect to login)
        console.error('Refresh token failed:', error);
        localStorage.removeItem('adminAccessToken');
        localStorage.removeItem('adminRefreshToken');
        window.location.replace('/admin/login');  // Example: Redirect to admin login page on token expiration
        return Promise.reject(error);  // Optionally handle promise rejection
      }
    }

    return Promise.reject(error);  // Return error for any other cases
  }
);

export default axiosAdmin;
