import React, { useEffect } from 'react';
import { useNavigationType, useLocation } from 'react-router-dom';
import Header from './Header';
import SettingsDrawer from './SettingsDrawer';
import { useDrawerStore } from '../stores/useDrawerStore';
import '../styles/App.css';
import Swal from 'sweetalert2';

const publicPaths = [
  '/',
  '/login',
  '/signup',
  '/find-id',
  '/find-password',
  '/change-nickname',
];

const AppLayout = ({ children }) => {
  const {
    isDrawerOpen,
    closeDrawer,
    openDrawer,
    shouldAutoOpen,
    setShouldAutoOpen,
  } = useDrawerStore();

  const action = useNavigationType();
  const location = useLocation();
  const path = location.pathname;

  const isPublicPath = publicPaths.includes(path);

  const isMainPage = path === '/main';
  const allowDrawerPaths = ['/main'];
  const isDrawerAllowed = allowDrawerPaths.includes(path);

  // ✅ 세션 만료 여부 판단 함수
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return true;
    }
  };

  // ✅ 창 닫음 여부 기록
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('wasClosed', 'true');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // ✅ 닫았다가 재진입한 경우 wasClosed 초기화
  useEffect(() => {
    if (localStorage.getItem('wasClosed') === 'true') {
      localStorage.removeItem('wasClosed');
    }
  }, []);

  // ✅ Drawer 열림 여부 판단
  useEffect(() => {
    if (isMainPage) {
      const fromState = location.state?.autoOpenDrawer;

      if (action === 'POP') {
        // 뒤로가기인 경우 무조건 닫기
        closeDrawer();
      } else if (fromState || shouldAutoOpen) {
        openDrawer();
        setShouldAutoOpen(false);
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
    const wasClosed = localStorage.getItem('wasClosed');
    const now = Date.now();

    // 🔸 세션 만료 처리
    if (expiredFlag === 'true') {
      localStorage.removeItem('sessionExpired');
      localStorage.removeItem('expiredTime');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      window.location.href = '/login';
      return;
    }

    // 🔸 탈퇴 후 유지 허용
    if (!token && justDeleted === 'true') {
      if (!isPublicPath) {
        setTimeout(() => {
          localStorage.removeItem('justDeleted');
          window.location.href = '/login';
        }, 2000);
      }
      return;
    }

    // 🔸 인증 없이 접근 차단
    if (!token && !isPublicPath) {
      window.location.href = '/login';
      return;
    }

    // 🔸 토큰 존재 시 세션 만료 여부 판단
    if (token && isTokenExpired(token)) {
      // 닫았다가 다시 들어온 경우 무시
      if (wasClosed === 'true') return;

      const lastExpiredTime = localStorage.getItem('expiredTime');
      const alreadyNotified =
        lastExpiredTime && now - parseInt(lastExpiredTime, 10) <= 5000;

      if (!alreadyNotified) {
        localStorage.setItem('sessionExpired', 'true');
        localStorage.setItem('expiredTime', now.toString());

        /* Swal.fire({
          icon: 'info',
          title: '세션 만료',
          text: '보안을 위해 자동 로그아웃 되었습니다.',
          confirmButtonColor: '#ffa158',
          confirmButtonText: '확인',
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(() => { */
        window.location.href = '/login';
        // });
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
