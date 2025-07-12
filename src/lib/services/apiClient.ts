import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://apighesti.peykkhorshid.ir/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient; 