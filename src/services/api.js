import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Add a request interceptor to attach the auth token
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('eams_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error("Could not parse user from local storage", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
