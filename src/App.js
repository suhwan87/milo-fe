import React from 'react';
import './fonts/TDTDTadakTadak.ttf';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Splash from './pages/Splash.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import FindId from './components/FindId';
import FindPassword from './components/FindPassword';
import MainPage from './pages/MainPage';
import AppLayout from './components/AppLayout';
import EmotionReport from './pages/EmotionReport';

function App() {
  return (
    <Router>
      <Routes>
        {/* Splash는 풀화면 처리 → 예외 처리 가능 */}
        <Route path="/" element={<Splash />} />

        <Route
          path="/login"
          element={
            <AppLayout>
              <Login />
            </AppLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <AppLayout>
              <SignUp />
            </AppLayout>
          }
        />
        <Route
          path="/find-id"
          element={
            <AppLayout>
              <FindId />
            </AppLayout>
          }
        />
        <Route
          path="/find-password"
          element={
            <AppLayout>
              <FindPassword />
            </AppLayout>
          }
        />
        <Route
          path="/main"
          element={
            <AppLayout>
              <MainPage />
            </AppLayout>
          }
        />
        <Route
          path="/emotion-report"
          element={
            <AppLayout>
              <EmotionReport />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
