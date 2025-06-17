import React from 'react';
import './fonts/TDTDTadakTadak.ttf';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './config/chartConfig'; // 차트 등록
// 초기페이지
import Splash from './pages/Splash.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import FindId from './components/FindId';
import FindPassword from './components/FindPassword';
// 메인페이지
import MainPage from './pages/MainPage';
import AppLayout from './components/AppLayout';
import EmotionReport from './pages/EmotionReport';
import EmotionArchivePage from './pages/EmotionArchivePage';
import MindDrawerPage from './pages/MindDrawerPage';
// 챗봇
import ChatBot1 from './pages/ChatBot1';
import RolePlay from './pages/RolePlay';
import ChatBot2 from './pages/ChatBot2';
// 설정
import ChangeNickname from './pages/settings/ChangeNickname';
import ChangePassword from './pages/settings/ChangePassword';
import ChatStyle from './pages/settings/ChatStyle';
import Inquiry from './pages/settings/Inquiry';
import Terms from './pages/settings/Terms';
import Withdraw from './pages/settings/Withdraw';

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

        {/* 챗봇 */}
        <Route path="/chat" element={<ChatBot1 />} />
        <Route path="/roleplay" element={<RolePlay />} />
        <Route path="/roleplay/chat" element={<ChatBot2 />} />

        {/* 설정 */}
        <Route path="/settings/nickname" element={<ChangeNickname />} />
        <Route path="/settings/password" element={<ChangePassword />} />
        <Route path="/settings/chat-style" element={<ChatStyle />} />
        <Route path="/settings/inquiry" element={<Inquiry />} />
        <Route path="/settings/terms" element={<Terms />} />
        <Route path="/settings/withdraw" element={<Withdraw />} />
      </Routes>
    </Router>
  );
}

export default App;
