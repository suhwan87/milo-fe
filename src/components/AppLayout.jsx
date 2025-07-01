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
  } = useDrawerStore(); // openDrawer 추가
  const location = useLocation();

  const isMainPage = location.pathname === '/main';
  const allowDrawerPaths = ['/main'];

  const isDrawerAllowed = allowDrawerPaths.includes(location.pathname);

  useEffect(() => {
    if (isMainPage) {
      if (shouldAutoOpen) {
        openDrawer(); // 뒤로가기에서만 열기
        setShouldAutoOpen(false); // 한 번 쓰면 다시 false
      } else {
        closeDrawer(); // 직접 이동은 닫기
      }
    } else {
      closeDrawer(); // 메인 외는 무조건 닫기
    }
  }, [location.pathname]);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = Date.now() > payload.exp * 1000;

      if (isExpired) {
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
    } catch (e) {
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
  }, []);

  return (
    // scrollable-container를 AppLayout에서 관리
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
