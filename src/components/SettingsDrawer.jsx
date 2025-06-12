// src/components/SettingsDrawer.jsx
import React from 'react';
import '../styles/SettingsDrawer.css';

const SettingsDrawer = ({ isOpen, onClose }) => {
  return (
    <>
      {/* 반투명 배경 */}
      <div
        className={`drawer-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      ></div>

      {/* 사이드 메뉴 */}
      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <button onClick={onClose}>←</button>
          <span>설정</span>
        </div>

        <div className="drawer-section">
          <p className="setting-section-title">회원정보</p>
          <div className="drawer-item">닉네임 변경</div>
          <div className="drawer-item">비밀번호 변경</div>
        </div>

        <div className="drawer-section">
          <p className="setting-section-title">챗봇</p>
          <div className="drawer-item">대화 스타일 변경</div>
          <div className="drawer-item">앱 초기화</div>
        </div>

        <div className="drawer-section">
          <p className="setting-section-title">서비스</p>
          <div className="drawer-item">문의하기</div>
          <div className="drawer-item">서비스 이용약관</div>
          <div className="drawer-item">로그아웃</div>
        </div>

        <div className="drawer-footer">🗑 회원탈퇴</div>
      </div>
    </>
  );
};

export default SettingsDrawer;
