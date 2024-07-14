import axios from 'axios';

const login = async (credentials) => {
  try {
    const response = await axios.post('http://localhost:8000/api/login/', credentials);
    console.log('Login successful:', response.data);
    return response.data; // Optionally return data for further processing
  } catch (error) {
    console.error('Error logging in:', error);
    throw error; // Propagate the error for higher-level error handling if needed
  }
};

const signup = async (data) => {
  try {
    const response = await axios.post('http://localhost:8000/api/signup/', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Signup successful:', response.data);
    return response.data; // Optionally return data for further processing
  } catch (error) {
    console.error('Error signing up:', error);
    throw error; // Propagate the error for higher-level error handling if needed
  }
};

export { login, signup };
