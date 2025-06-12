// src/components/Header.jsx
import React, { useState } from 'react';
import '../styles/Header.css';
import SettingsDrawer from './SettingsDrawer';

const Header = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
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
      </header>

      {/* ✅ drawer를 header 바깥에서 but app-frame 안에서 */}
      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default Header;
