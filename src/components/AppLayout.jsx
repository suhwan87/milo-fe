// src/components/AppLayout.jsx
import React, { useState } from 'react';
import '../styles/App.css';
import Header from './Header';
import SettingsDrawer from './SettingsDrawer';

const AppLayout = ({ children }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="app-frame">
      <Header onDrawerToggle={() => setDrawerOpen(true)} />
      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      {children}
    </div>
  );
};

export default AppLayout;
