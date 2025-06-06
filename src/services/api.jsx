import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
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

export const login = async (login, senhaUsuario) => {
  console.log("Enviando para a API:", { login, senhaUsuario }); // Log dos dados enviados
  try {
    const response = await api.post('/auth/login', { login, senhaUsuario });
    console.log("Resposta da API:", response.data); // Log da resposta
    return response.data;
  } catch (error) {
    console.error("Erro no login:", error.response ? error.response.data : error.message);
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
    const response = await api.get('/usuario');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchConsumoClientes = async () => {
  try {
    const response = await api.get('/api/consumo-clientes');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchStatusClientes = async () => {
  try {
    const response = await api.get('/api/status-clientes');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchFaturamentoMensal = async () => {
  try {
    const response = await api.get('/api/faturamento-mensal');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export default api;
