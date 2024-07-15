import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/',  // Adjust baseURL as per your API endpoint
  withCredentials: true,  // Enable if you need to send cookies or authentication headers with cross-origin requests
});

// Request interceptor to add Authorization header with JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
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
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refreshToken');
    
    // If the error status is 401 and there's a refresh token available
    if (error.response.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;  // Prevent infinite loop

      try {
        // Request new access token using refresh token
        const response = await axiosInstance.post('/token/refresh/', { refresh: refreshToken });
        const newAccessToken = response.data.access;

        // Update local storage with new access token
        localStorage.setItem('accessToken', newAccessToken);
        
        // Update original request headers with new access token and retry original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        // Handle refresh token failure (e.g., clear tokens and redirect to login)
        console.error('Refresh token failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.replace('/login');  // Example: Redirect to login page on token expiration
        return Promise.reject(error);  // Optionally handle promise rejection
      }
    }

    return Promise.reject(error);  // Return error for any other cases
  }
);

export default axiosInstance;
