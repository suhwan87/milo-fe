// 메인 화면 헤더 공통 컴포넌트
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ onDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === '/main') {
      window.location.reload();
    } else {
      navigate('/main');
    }
  };

  return (
    <header className="header">
      <h1
        className="header-logo"
        style={{ fontFamily: 'Tadak', cursor: 'pointer' }}
        onClick={handleLogoClick}
      >
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
