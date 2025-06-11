import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import loginCharacter from '../assets/characters/login-character.png';

function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 로직 (추후 Firebase 또는 API 연동)
    console.log('Login attempt:', { id, password });
    navigate('/main'); // 임시 이동
  };

  return (
    <div className="login-container">
      <div className="character-logo">
        <img src={loginCharacter} alt="milo 캐릭터" className="character1" />
        <h2 className="logo1">Milo.</h2>
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        아이디
        <input
          type="text"
          placeholder="아이디를 입력해주세요"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        비밀번호
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요"
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
