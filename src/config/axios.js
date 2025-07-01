// 공통 axios 인스턴스 생성
import axios from 'axios';

// 로컬 여부에 따라 baseURL 분기
const isLocal = window.location.hostname === 'localhost';

const instance = axios.create({
  baseURL: isLocal ? 'http://localhost:8085' : 'http://211.188.59.173:8085',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함 (세션 처리용)
});

// 요청 인터셉터: Authorization 헤더 자동 삽입
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized 응답 → 토큰 만료 or 위조
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');

      // 강제 리다이렉트
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);
export default instance;
