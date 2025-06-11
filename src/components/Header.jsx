// src/components/Header.jsx
import React from 'react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-logo" style={{ fontFamily: 'Tadak' }}>
        Milo.<span className="dot"></span>
      </h1>
      <div className="header-icons">
        <button className="header-icon">🤍</button>
        <button className="header-icon">☰</button>
      </div>
    </header>
  );
};

export default Header;
