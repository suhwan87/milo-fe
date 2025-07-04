// src/components/AppLayout.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import SettingsDrawer from './SettingsDrawer';
import { useDrawerStore } from '../stores/useDrawerStore';
import '../styles/App.css';
import Swal from 'sweetalert2';

const AppLayout = ({ children }) => {
  const {
    isDrawerOpen,
    closeDrawer,
    openDrawer,
    shouldAutoOpen,
    setShouldAutoOpen,
  } = useDrawerStore();
  const location = useLocation();

  const isMainPage = location.pathname === '/main';
  const allowDrawerPaths = ['/main'];
  const isDrawerAllowed = allowDrawerPaths.includes(location.pathname);

  useEffect(() => {
    if (isMainPage) {
      if (shouldAutoOpen) {
        openDrawer();
        setShouldAutoOpen(false);
      } else {
        closeDrawer();
      }
    } else {
      closeDrawer();
    }
  }, [
    location.pathname,
    shouldAutoOpen,
    openDrawer,
    closeDrawer,
    setShouldAutoOpen,
    isMainPage,
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiredFlag = localStorage.getItem('sessionExpired');
    const justDeleted = localStorage.getItem('justDeleted');
    const path = location.pathname;

    const isLoginPage = path === '/login';

    // ✅ 인증 없이 접근 가능한 경로 목록
    const publicPaths = [
      '/',
      '/login',
      '/signup',
      '/find-id',
      '/find-password',
      '/change-nickname',
    ];

    const isPublicPath = publicPaths.includes(path);

    // 🔸 세션 만료 시 처리
    if (expiredFlag === 'true') {
      localStorage.removeItem('sessionExpired');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
      return;
    }

    // 🔸 탈퇴 후 페이지 유지: 인증이 없고 justDeleted가 true일 때도 publicPath는 허용
    if (!token && justDeleted === 'true') {
      if (!isPublicPath) {
        setTimeout(() => {
          localStorage.removeItem('justDeleted');
          window.location.href = '/login';
        }, 2000);
      }
      return; // publicPath일 경우 아무 처리도 하지 않음
    }

    // 🔸 인증 없는 상태에서 접근 제한
    if (!token && !isPublicPath) {
      window.location.href = '/login';
      return;
    }

    // 🔸 토큰 유효성 검사
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = Date.now() > payload.exp * 1000;

        if (isExpired) {
          localStorage.setItem('sessionExpired', 'true');
          Swal.fire({
            icon: 'info',
            title: '세션 만료',
            text: '보안을 위해 자동 로그아웃 되었습니다.',
            confirmButtonColor: '#ffa158',
            confirmButtonText: '확인',
          }).then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            window.location.href = '/login';
          });
        }
      } catch {
        Swal.fire({
          icon: 'error',
          title: '잘못된 로그인 정보',
          text: '보안을 위해 다시 로그인해주세요.',
          confirmButtonColor: '#d33',
          confirmButtonText: '확인',
        }).then(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          window.location.href = '/login';
        });
      }
    }
  }, [location.pathname]);

  return (
    <div className="scrollable-container">
      <div className="app-frame">
        {isDrawerAllowed && <Header onDrawerToggle={openDrawer} />}
        {isDrawerAllowed && (
          <SettingsDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
        )}
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
