// src/config/auth.js
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// 토큰 만료 여부 확인 함수
export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // JWT payload 디코딩
    const exp = payload.exp * 1000; // 초 → 밀리초 변환
    return Date.now() > exp; // 현재 시간이 만료시간보다 크면 true
  } catch (e) {
    return true; // 디코딩 실패 = 잘못된 토큰
  }
};
