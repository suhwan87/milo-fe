import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/App.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
// React 18 이상 방식의 렌더링
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
