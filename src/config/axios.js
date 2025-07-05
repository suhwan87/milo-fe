// src/config/axios.js

import axios from 'axios';

// 로컬 환경 여부 판단
const isLocal = window.location.hostname === 'localhost';

// baseURL 설정
const instance = axios.create({
  baseURL: isLocal
    ? 'http://localhost:8085' // 로컬 백엔드 주소
    : 'https://soswithmilo.site', // 배포된 도메인 (프록시로 /api 처리)
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // JWT 쿠키나 세션 사용 시 필요
});

// 요청 인터셉터: Authorization 헤더 자동 추가
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 인증 오류 시 리다이렉트 처리
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login'; // 로그인 페이지로 이동
    }
    return Promise.reject(error);
  }
);

export default instance;
