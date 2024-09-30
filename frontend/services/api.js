import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://10.0.2.2:5000/api',
  timeout: 10000,
  withCredentials: true,
});

// Attach Authorization header for requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code outside the range of 2xx
      throw error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please try again later.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
      throw new Error('An error occurred while making the request.');
    }
  }
};

// Update User Profile (including image, name, address, phone)
export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}/update-profile`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle server-side error
      throw error.response.data;
    } else if (error.request) {
      // Handle network error (no response)
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please try again later.');
    } else {
      // Handle any other errors
      console.error('Error:', error.message);
      throw new Error('An error occurred while making the request.');
    }
  }
};

// Delete User
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/auth/user/${userId}/delete`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please try again later.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An error occurred while making the request.');
    }
  }
};

// Update Email or Password
export const updateEmailOrPassword = async (userId, { oldPassword, newEmail, newPassword }) => {
  try {
    const response = await api.put(`/auth/user/${userId}/update-email-password`, {
      oldPassword,
      newEmail,
      newPassword,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else if (error.request) {
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please try again later.');
    } else {
      console.error('Error:', error.message);
      throw new Error('An error occurred while making the request.');
    }
  }
};

export default {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`)
};
