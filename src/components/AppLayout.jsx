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
  const path = location.pathname;

  const isMainPage = path === '/main';
  const allowDrawerPaths = ['/main'];
  const isDrawerAllowed = allowDrawerPaths.includes(path);

  // ✅ Drawer 열림 여부 판단
  useEffect(() => {
    if (isMainPage) {
      const fromState = location.state?.autoOpenDrawer;
      if (fromState || shouldAutoOpen) {
        openDrawer();
        setShouldAutoOpen(false); // ✅ 전역 상태 초기화 (단발성)
      } else {
        closeDrawer();
      }
    } else {
      closeDrawer();
    }
  }, [
    path,
    shouldAutoOpen,
    location.state,
    isMainPage,
    openDrawer,
    closeDrawer,
    setShouldAutoOpen,
  ]);

  // ✅ 인증 및 세션 체크
  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiredFlag = localStorage.getItem('sessionExpired');
    const justDeleted = localStorage.getItem('justDeleted');

    const publicPaths = [
      '/',
      '/login',
      '/signup',
      '/find-id',
      '/find-password',
      '/change-nickname',
    ];

    const isPublicPath = publicPaths.includes(path);

    // 🔸 세션 만료 처리
    if (expiredFlag === 'true') {
      localStorage.removeItem('sessionExpired');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
      return;
    }

    // 🔸 탈퇴 후 유지 허용 처리
    if (!token && justDeleted === 'true') {
      if (!isPublicPath) {
        setTimeout(() => {
          localStorage.removeItem('justDeleted');
          window.location.href = '/login';
        }, 2000);
      }
      return;
    }

    // 🔸 인증 없는 접근 차단
    if (!token && !isPublicPath) {
      window.location.href = '/login';
      return;
    }

    // 🔸 토큰 만료 확인
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
  }, [path]);

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
