import axios from 'axios';
import { getTokenCookie } from './auth';

const API_URL = 'http://localhost:5000'; // Sesuaikan dengan URL API backend Anda

const axiosInstance = axios.create({
  baseURL: API_URL,
});

const fetchUserData = async () => {
  const token = getTokenCookie();

  try {
    const response = await axios.get('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

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

export const getAllQuestions = async (sort, page, perPage) => {
  try {
    const response = await axios.get(`${API_URL}/questions`, {
      params: { sort, page, perPage }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getQuestionById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/questions/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPopularTags = async () => {
  try {
    const response = await axios.get(`${API_URL}/tags/popular`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDiscussionsByTag = async (tag, page, pageSize) => {
  try {
    const response = await axios.get(`${API_URL}/tags/${tag}`, {
      params: { page, pageSize }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchQuestions = async (keyword) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { keyword }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
