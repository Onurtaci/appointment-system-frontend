import axios, { AxiosError } from 'axios';

// Extend the Axios config type to include our retry count
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    __retryCount?: number;
  }
}

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config;
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      return Promise.reject(error);
    }
    
    // Handle server errors
    if (error.response?.status === 500) {
      // Don't retry on 500 errors as they are likely application errors
      return Promise.reject(error);
    }

    // Don't retry if:
    // 1. No config
    // 2. Already retried
    // 3. Request was cancelled
    // 4. Error is not a network error or 429 (rate limit)
    if (!config || config.__retryCount || error.code === 'ECONNABORTED' || 
        (error.response && error.response.status !== 429)) {
      return Promise.reject(error);
    }

    // Initialize retry count
    config.__retryCount = config.__retryCount || 0;
    
    // Maximum number of retries
    const maxRetries = 2; // Reduced from 3 to 2
    
    if (config.__retryCount < maxRetries) {
      // Increment retry count
      config.__retryCount += 1;
      
      // Exponential backoff delay
      const delay = Math.min(1000 * Math.pow(2, config.__retryCount), 5000); // Reduced max delay to 5s
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Retry the request
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api; 