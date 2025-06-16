// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ onDrawerToggle }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <h1 className="header-logo" style={{ fontFamily: 'Tadak' }}>
        Milo.
      </h1>
      <div className="header-icons">
        <button
          className="header-icon"
          onClick={() => navigate('/mind-drawer')}
        >
          🤍
        </button>
        <button className="header-icon" onClick={onDrawerToggle}>
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
