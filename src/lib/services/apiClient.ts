import axios, { AxiosResponse, AxiosError } from 'axios';
import config from '@/lib/config/environment';

const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for handling successes and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // For successful responses (2xx), just return the data
    return response;
  },
  (error: AxiosError) => {
    // For error responses, log the error and reject the promise
    // This will trigger the .catch() block in your components
    console.error('API Error:', error.response?.data || error.message);
    
    // It's important to return a rejected promise to propagate the error
    return Promise.reject(error);
  }
);

export default apiClient; 