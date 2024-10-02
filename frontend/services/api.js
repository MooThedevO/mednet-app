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

// Fetch user profile
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Update user profile
export const updateUserProfile = async (userId, userData) => {
  try {
    const response = await api.put(`/users/${userId}/update-profile`, userData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Delete user
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/auth/user/${userId}/delete`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Update email or password
export const updateEmailOrPassword = async (userId, { oldPassword, newEmail, newPassword }) => {
  try {
    const response = await api.put(`/auth/user/${userId}/update-email-password`, {
      oldPassword,
      newEmail,
      newPassword,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Request-related API calls
export const getAllRequests = async () => {
  try {
    const response = await api.get('/medication-requests');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getRequestById = async (requestId) => {
  try {
    const response = await api.get(`/medication-requests/${requestId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addRequest = async (requestData) => {
  try {
    const response = await api.post('/medication-requests', requestData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateRequest = async (requestId, requestData) => {
  try {
    const response = await api.put(`/medication-requests/${requestId}`, requestData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteRequest = async (requestId) => {
  try {
    const response = await api.delete(`/medication-requests/${requestId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Donation-related API calls
export const getAllDonations = async () => {
  try {
    const response = await api.get('/donations');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addDonation = async (donationData) => {
  try {
    const response = await api.post('/donations', donationData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateDonation = async (donationId, donationData) => {
  try {
    const response = await api.put(`/donations/${donationId}`, donationData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteDonation = async (donationId) => {
  try {
    const response = await api.delete(`/donations/${donationId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Handle API errors
const handleApiError = (error) => {
  if (error.response) {
    throw error.response.data;
  } else if (error.request) {
    console.error('No response received:', error.request);
    throw new Error('No response from server. Please try again later.');
  } else {
    console.error('Error:', error.message);
    throw new Error('An error occurred while making the request.');
  }
};

export default {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
};
