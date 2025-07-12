import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://apighesti.peykkhorshid.ir',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient; 