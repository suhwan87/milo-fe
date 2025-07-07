import React from 'react';
import '../styles/SettingsDrawer.css';
import { useNavigate } from 'react-router-dom';

import { FaUser, FaLock, FaRegCommentDots } from 'react-icons/fa';
import { RiChatSmile3Line } from 'react-icons/ri';
import { RxReset } from 'react-icons/rx';
import { FiInfo, FiLogOut, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';
import api from '../config/axios';

const SettingsDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // ✅ 유저 ID와 카카오 여부
  const userId = localStorage.getItem('userId');
  const isKakaoUser = userId?.startsWith('kakao_');

  // 앱 초기화
  const handleResetApp = async () => {
    const result = await Swal.fire({
      title: '앱 초기화',
      text: '기기에 저장된 기록과 서버에 저장된 모든 감정 리포트, 회복 문장이 삭제돼요. 정말 초기화할까요?',
      showCancelButton: true,
      confirmButtonText: '확인',
      cancelButtonText: '취소',
      confirmButtonColor: '#ff9f4a',
      cancelButtonColor: '#dcdcdc',
      customClass: {
        popup: 'reset-popup',
        title: 'reset-title',
        htmlContainer: 'reset-text',
        confirmButton: 'reset-confirm',
        cancelButton: 'reset-cancel',
      },
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem('token');
      await api.delete('/api/users/reset', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.clear();
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      await Swal.fire({
        icon: 'success',
        title: '초기화 완료',
        text: '앱이 초기화되었어요!',
        confirmButtonText: '확인',
      });

      window.location.reload();
    } catch (err) {
      console.error('[앱초기화 오류]', err);
      Swal.fire({
        icon: 'error',
        title: '초기화 실패',
        text: '앱 초기화 중 문제가 발생했어요. 다시 시도해 주세요.',
      });
    }
  };

  // 로그아웃
  const handleLogout = () => {
    Swal.fire({
      title: '정말 로그아웃하시겠어요?',
      text: '다시 로그인해야 서비스를 이용할 수 있어요.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '로그아웃',
      cancelButtonText: '취소',
      confirmButtonColor: '#ff9f4a',
      cancelButtonColor: '#dcdcdc',
    }).then((result) => {
      if (!result.isConfirmed) return;

      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem(`lastChatEnd_${userId}`);
      localStorage.removeItem(`chatMessages_${userId}`);

      if (isKakaoUser) {
        const REST_API_KEY = 'aabaae0d39dbd263ec77dc1cbf25e85f';
        const redirectUri =
          window.location.hostname === 'localhost'
            ? 'http://localhost:3000/login'
            : 'http://soswithmilo.site/login';

        window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${redirectUri}`;
      } else {
        window.location.href = '/login';
      }
    });
  };

  return (
    <>
      <div
        className={`drawer-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      ></div>

      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <button onClick={onClose} className="drawer-header-back">
            ←
          </button>
          <span>설정</span>
        </div>

        {/* 회원정보 섹션 */}
        <div className="drawer-section">
          <p className="setting-section-title">회원정보</p>

          <div
            className="drawer-item"
            onClick={() => navigate('/settings/nickname')}
          >
            <FaUser className="drawer-item-icon" />
            닉네임 변경
          </div>

          <div
            className="drawer-item"
            onClick={() => {
              if (isKakaoUser) {
                Swal.fire({
                  icon: 'warning',
                  title: '비밀번호 변경 불가',
                  text: '카카오 로그인 사용자는 비밀번호를 변경할 수 없습니다.',
                  confirmButtonColor: '#ffa158',
                  confirmButtonText: '확인',
                });
              } else {
                navigate('/settings/password');
              }
            }}
          >
            <FaLock className="drawer-item-icon" />
            비밀번호 변경
          </div>
        </div>

        {/* 챗봇 섹션 */}
        <div className="drawer-section">
          <p className="setting-section-title">챗봇</p>
          <div
            className="drawer-item"
            onClick={() => navigate('/settings/chat-style')}
          >
            <RiChatSmile3Line className="drawer-item-icon" />
            대화 스타일 변경
          </div>
          <div className="drawer-item" onClick={handleResetApp}>
            <RxReset className="drawer-item-icon" />앱 초기화
          </div>
        </div>

        {/* 서비스 관련 섹션 */}
        <div className="drawer-section">
          <p className="setting-section-title">서비스</p>
          <div
            className="drawer-item"
            onClick={() => navigate('/settings/inquiry')}
          >
            <FaRegCommentDots className="drawer-item-icon" />
            문의하기
          </div>
          <div
            className="drawer-item"
            onClick={() => navigate('/settings/terms')}
          >
            <FiInfo className="drawer-item-icon" />
            서비스 이용약관
          </div>
          <div className="drawer-item" onClick={handleLogout}>
            <FiLogOut className="drawer-item-icon" />
            로그아웃
          </div>
        </div>

        {/* 하단 회원 탈퇴 */}
        <div
          className="drawer-footer"
          onClick={() => navigate('/settings/Withdraw')}
        >
          <FiTrash2 className="drawer-item-icon" />
          회원탈퇴
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;
