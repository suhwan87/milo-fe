import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //   const handleLogin = (e) => {
  //     e.preventDefault();
  //     // 로그인 로직 (추후 Firebase 또는 API 연동)
  //     console.log("Login attempt:", { email, password });
  //     navigate("/home"); // 임시 이동
  //   };

  return (
    <div className="login-container">
      <div className="character-logo">
        <img
          src="/assets/milo_character1.png"
          alt="milo 캐릭터"
          className="character1"
        />
        <h2 className="logo1">Milo.</h2>
      </div>
      <form className="login-form" /*onSubmit={handleLogin}*/>
        아이디
        <input
          type="email"
          placeholder="아이디를 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        패스워드
        <input
          type="password"
          placeholder="패스워드를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="find-info">
          <span onClick={() => navigate('/find-id')}>아이디 찾기 </span> |
          <span onClick={() => navigate('/find-password')}> 비밀번호 찾기</span>
        </div>
        <button type="submit">로그인</button>
      </form>
      <p className="login-footer">
        아직 계정이 없으신가요?{' '}
        <span onClick={() => navigate('/signup')}>Signup</span>
      </p>
    </div>
  );
}

export default Login;
