// src/components/AppLayout.jsx
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import SettingsDrawer from './SettingsDrawer';
import '../styles/App.css';

const AppLayout = ({ children }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // ✅ Header는 오직 /main 경로에서만 보여야 함
  const showHeaderOnlyIn = ['/main'];
  const isHeaderVisible = showHeaderOnlyIn.includes(location.pathname);

  return (
    <div className="app-frame">
      {isHeaderVisible && <Header onDrawerToggle={() => setDrawerOpen(true)} />}
      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      {children}
    </div>
  );
};

export default AppLayout;
