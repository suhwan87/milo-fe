// src/config/axios.js

import axios from 'axios';

// 로컬 환경 여부 판단
const isLocal = window.location.hostname === 'localhost';

const instance = axios.create({
  baseURL: isLocal
    ? 'http://localhost:8085/api' // 로컬 개발용 백엔드 주소
    : '/api', // 🔥 배포 시에는 nginx 프록시 경로 사용 (HTTPS 환경 안전)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터: 토큰 자동 첨부
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 인증 실패 시 처리
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
