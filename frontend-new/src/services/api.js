import axios from 'axios';

// Détection intelligente de l'URL API
const isLocal = window.location.hostname === 'localhost';

const baseURL = isLocal 
  ? (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')
  : 'https://tontipay.onrender.com/api';

console.log("🚀 API Base URL:", baseURL);
console.log("📍 Environment:", isLocal ? "Local" : "Production");

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
