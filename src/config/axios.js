// src/config/axios.js
import axios from 'axios';

// ✅ 백엔드 서버 주소 설정
const instance = axios.create({
  baseURL: 'http://localhost:8085', // 백엔드 포트 맞춰서 수정
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ 요청마다 토큰을 자동으로 헤더에 포함시키는 인터셉터
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // 저장된 JWT 토큰 불러오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 헤더에 토큰 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // 요청 에러 처리
  }
);

export default instance;
