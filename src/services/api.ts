import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: number;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Request interceptor to add token
    this.api.interceptors.request.use(
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

    // Response interceptor for error handling and retry logic
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as RetryConfig;

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Retry logic for network errors or 5xx errors
        const shouldRetry =
          !error.response || // Network error
          (error.response.status >= 500 && error.response.status < 600); // Server error

        if (shouldRetry && config) {
          config._retry = config._retry || 0;

          if (config._retry < MAX_RETRIES) {
            config._retry += 1;

            // Wait before retrying
            await new Promise((resolve) =>
              setTimeout(resolve, RETRY_DELAY * config._retry!)
            );

            return this.api(config);
          }
        }

        // Format error message
        const errorMessage = this.formatError(error);
        return Promise.reject(errorMessage);
      }
    );
  }

  private formatError(error: AxiosError): Error {
    if (error.response) {
      // Server responded with error
      const data = error.response.data as any;
      const message = data?.error?.message || data?.message || 'An error occurred';
      const messageAr = data?.error?.messageAr || data?.messageAr;
      
      const formattedError = new Error(message);
      (formattedError as any).messageAr = messageAr;
      (formattedError as any).status = error.response.status;
      (formattedError as any).data = data;
      
      return formattedError;
    } else if (error.request) {
      // Request made but no response
      return new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  getInstance() {
    return this.api;
  }
}

export const apiService = new ApiService();
export const api = apiService.getInstance();
