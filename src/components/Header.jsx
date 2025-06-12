// src/components/Header.jsx
import React from 'react';
import '../styles/Header.css';

const Header = ({ onDrawerToggle }) => {
  return (
    <header className="header">
      <h1 className="header-logo" style={{ fontFamily: 'Tadak' }}>
        Milo.
      </h1>
      <div className="header-icons">
        <button className="header-icon">🤍</button>
        <button className="header-icon" onClick={onDrawerToggle}>
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
