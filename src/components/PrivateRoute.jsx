// 인증 여부 라우팅 관련 컴포넌트
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../config/auth';

const PrivateRoute = ({ children }) => {
  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  // 인증된 경우, 자식 컴포넌트 렌더링
  return children;
};

export default PrivateRoute;
