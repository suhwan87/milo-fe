import logo from "./logo.svg";
import './fonts/TDTDTadakTadak.ttf';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./components/Splash.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import FindId from "./components/FindId";
import FindPassword from "./components/FindPassword";

function App() {
  return (
    <Router>
      <Routes>
        {/* Splash 시작 페이지 */}
        <Route path="/" element={<Splash />} />

        {/* 로그인 페이지 */}
        <Route path="/login" element={<Login />} />

        {/* 회원가입 페이지 */}
        <Route path="/signup" element={<SignUp />} />

        {/* 아이디/비번 찾기 페이지 */}
        <Route path="/find-id" element={<FindId />} />
        <Route path="/find-password" element={<FindPassword />} />

        
      </Routes>
    </Router>
  );
}

export default App;
