import React from 'react';
import './fonts/TDTDTadakTadak.ttf';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './config/chartConfig';

// 인증 관련
import PrivateRoute from './components/PrivateRoute';

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
    // scrollable-container 제거하고 Router를 직접 렌더링
    <Router>
      <Routes>
        {/* 누구나 접근 가능한 경로 */}
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

        {/* 로그인한 사용자만 접근 가능한 경로 */}
        <Route
          path="/main"
          element={
            <PrivateRoute>
              <AppLayout>
                <MainPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/mind-drawer"
          element={
            <PrivateRoute>
              <AppLayout>
                <MindDrawerPage />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/emotion-report"
          element={
            <PrivateRoute>
              <AppLayout>
                <EmotionReport />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/emotion-archive"
          element={
            <PrivateRoute>
              <AppLayout>
                <EmotionArchivePage />
              </AppLayout>
            </PrivateRoute>
          }
        />

        {/* 챗봇 */}
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatBot1 />
            </PrivateRoute>
          }
        />
        <Route
          path="/roleplay"
          element={
            <PrivateRoute>
              <RolePlay />
            </PrivateRoute>
          }
        />
        <Route
          path="/roleplay/chat"
          element={
            <PrivateRoute>
              <ChatBot2 />
            </PrivateRoute>
          }
        />

        {/* 설정 */}
        <Route
          path="/settings/nickname"
          element={
            <PrivateRoute>
              <ChangeNickname />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/password"
          element={
            <PrivateRoute>
              <ChangePassword />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/chat-style"
          element={
            <PrivateRoute>
              <ChatStyle />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/inquiry"
          element={
            <PrivateRoute>
              <Inquiry />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/terms"
          element={
            <PrivateRoute>
              <Terms />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/withdraw"
          element={
            <PrivateRoute>
              <Withdraw />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
