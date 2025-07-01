// 앱 기준 레이아웃 컴포넌트
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import SettingsDrawer from './SettingsDrawer';
import { useDrawerStore } from '../stores/useDrawerStore';
import '../styles/App.css';
import Swal from 'sweetalert2';

const AppLayout = ({ children }) => {
  // 상태 관리: 설정창(drawer) 관련 전역 상태
  const {
    isDrawerOpen,
    closeDrawer,
    openDrawer,
    shouldAutoOpen,
    setShouldAutoOpen,
  } = useDrawerStore();
  const location = useLocation();

  const isMainPage = location.pathname === '/main';
  const allowDrawerPaths = ['/main']; // drawer 허용 경로

  const isDrawerAllowed = allowDrawerPaths.includes(location.pathname);

  // 페이지 이동 시 drawer 열기/닫기 로직
  useEffect(() => {
    if (isMainPage) {
      if (shouldAutoOpen) {
        openDrawer(); // 뒤로가기 진입 시 자동 열림
        setShouldAutoOpen(false); // 한 번 사용 후 플래그 초기화
      } else {
        closeDrawer(); // 직접 진입 시 닫힘
      }
    } else {
      closeDrawer(); // 메인 외에는 항상 drawer 닫기
    }
  }, [location.pathname]);

  // 토큰 만료 여부 확인 → 만료 시 로그아웃 처리
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
