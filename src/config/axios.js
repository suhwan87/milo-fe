// src/config/axios.js
import axios from 'axios';

const isLocal = window.location.hostname === 'localhost';

const instance = axios.create({
  baseURL: isLocal ? 'http://localhost:8085' : 'http://211.188.59.173:8085',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 🔥 이거 유지하는 게 안전함!
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // ❗ 401 Unauthorized 응답 → 토큰 만료 or 위조
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');

      // 강제 리다이렉트
      window.location.href = '/login'; // 또는 navigate('/login')
    }

    return Promise.reject(error);
  }
);
export default instance;
