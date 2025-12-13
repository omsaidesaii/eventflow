import axios from 'axios';

const getBaseUrl = () => {
  let url = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || 'http://localhost:4000';
  
  // Remove trailing slash if present to standardize
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  
  // Append /api if not present
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  
  return url;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API Base URL:', api.defaults.baseURL);

export default api;
