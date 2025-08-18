import axios from 'axios';

// The base URL for your FastAPI backend
const API_URL = import.meta.env.VITE_API_URL;

console.log(API_URL)

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
// This function will be called before every request is sent.
// It retrieves the auth token from local storage and adds it to the
// 'Authorization' header if it exists.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

export default apiClient;
