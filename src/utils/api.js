import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Sesuaikan dengan URL API backend Anda

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/api/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response.data.msg || error.message;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post('/api/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response.data.msg || error.message;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axiosInstance.post('/api/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response.data.msg || error.message;
  }
};

export const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await axiosInstance.post(`/api/auth/reset-password/${resetToken}`, { newPassword });
    return response.data;
  } catch (error) {
    throw error.response.data.msg || error.message;
  }
};
