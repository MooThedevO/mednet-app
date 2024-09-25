import axios from 'axios';

// Create an Axios instance and configure it with your backend's base URL
const api = axios.create({
  baseURL: 'http://10.0.2.2:5000',  // This should point to your backend
  timeout: 10000,  // Set a timeout for the requests (optional)
});

// Example: Add a request interceptor for authorization
api.interceptors.request.use(
  (config) => {
    // Here, you can add authentication tokens if needed
    // Example: config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;