import axios, { AxiosResponse, AxiosError } from 'axios';

// تعیین URL بر اساس محیط
const getBaseURL = () => {
  // اگر متغیر محیطی تعریف شده باشد، از آن استفاده کن
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // در محیط production از URL اصلی استفاده کن
  if (import.meta.env.PROD) {
    return 'https://ghesti.peykkhorshid.ir';
  }
  
  // در محیط development از localhost استفاده کن
  return 'http://localhost:3001';
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
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