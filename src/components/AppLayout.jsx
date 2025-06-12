// src/components/AppLayout.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/App.css';
import Header from './Header';
import SettingsDrawer from './SettingsDrawer';

const AppLayout = ({ children }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // 로그인/회원가입/비밀번호찾기 등에서는 헤더 숨기기
  const hideHeaderPaths = [
    '/login',
    '/signup',
    '/find-id',
    '/find-password',
    '/',
  ];
  const isHeaderHidden = hideHeaderPaths.includes(location.pathname);

  return (
    <div className="app-frame">
      {!isHeaderHidden && <Header onDrawerToggle={() => setDrawerOpen(true)} />}
      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      {children}
    </div>
  );
};

export default AppLayout;
