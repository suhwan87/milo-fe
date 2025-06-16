import React from 'react';
import './fonts/TDTDTadakTadak.ttf';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './components/chartConfig'; // 차트 등록

import Splash from './pages/Splash.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import FindId from './components/FindId';
import FindPassword from './components/FindPassword';
import MainPage from './pages/MainPage';
import AppLayout from './components/AppLayout';
import EmotionReport from './pages/EmotionReport';
import ChatBot1 from './pages/ChatBot1';
import RolePlay from './pages/RolePlay';
import ChatBot2 from './pages/ChatBot2';
import EmotionArchivePage from './pages/EmotionArchivePage';
import MindDrawerPage from './pages/MindDrawerPage';

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
          path="/mind-drawer"
          element={
            <AppLayout>
              <MindDrawerPage />
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
        <Route
          path="/emotion-archive"
          element={
            <AppLayout>
              <EmotionArchivePage />
            </AppLayout>
          }
        />
        <Route path="/chat" element={<ChatBot1 />} />
        <Route path="/roleplay" element={<RolePlay />} />
        <Route path="/roleplay/chat" element={<ChatBot2 />} />
      </Routes>
    </Router>
  );
}

export default App;
