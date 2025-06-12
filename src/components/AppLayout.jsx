// src/components/AppLayout.jsx
import React from 'react';
import '../styles/App.css'; // .app-frame 정의 포함

const AppLayout = ({ children }) => {
  return <div className="app-frame">{children}</div>;
};

export default AppLayout;
