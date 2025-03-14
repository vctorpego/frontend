import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5432',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const signup = async (userData) => {
  try {
    const response = await api.post('/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const getUserData = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export default api;
