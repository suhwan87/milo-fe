import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import loginCharacter from '../assets/characters/login-character.png';
import Swal from 'sweetalert2';

function Login() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  const handleNavigate = (path) => {
    setFadeOut(true);
    setTimeout(() => {
      navigate(path);
    }, 300); // 페이드아웃과 타이밍 맞춤
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // 로그인 로직 (추후 Firebase 또는 API 연동)
    console.log('Login attempt:', { id, password });

    // ✅ SweetAlert2 알림
    Swal.fire({
      title: '로그인 완료!',
      text: '환영합니다 😊',
      icon: 'success',
      confirmButtonColor: '#ffa158',
      confirmButtonText: '확인',
    }).then(() => {
      // 페이드아웃
      setFadeOut(true);
      setTimeout(() => {
        navigate('/main'); // 500ms 뒤 페이지 이동
      }, 300);
    });
  };
  return (
    <div className={`Login ${fadeOut ? 'fade-out' : ''}`}>
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
            <span onClick={() => handleNavigate('/find-id')}>아이디 찾기</span>{' '}
            |
            <span onClick={() => handleNavigate('/find-password')}>
              {' '}
              비밀번호 찾기
            </span>
          </div>
          <button type="submit">Login</button>
        </form>
        <p className="login-footer">
          아직 계정이 없으신가요?{' '}
          <span onClick={() => handleNavigate('/signup')}>Signup</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
