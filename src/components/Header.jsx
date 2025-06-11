// src/components/Header.jsx
import React, { useState } from 'react';
import '../styles/Header.css';
import SettingsDrawer from './SettingsDrawer'; // ✅ 이거 경로 확인

const Header = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="header">
      <h1 className="header-logo" style={{ fontFamily: 'Tadak' }}>
        Milo.
      </h1>
      <div className="header-icons">
        <button className="header-icon">🤍</button>
        <button className="header-icon" onClick={() => setDrawerOpen(true)}>
          ☰
        </button>
      </div>

      {/* ✅ 설정 Drawer 연결 */}
      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </header>
  );
};

export default Header;
