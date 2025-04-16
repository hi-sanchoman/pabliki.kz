import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token logic here
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (401, 403, etc.)
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access');
      // You can add redirect to login page logic here
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
