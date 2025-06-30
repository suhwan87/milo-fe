import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import loginCharacter from '../assets/characters/login-character.png';
import Swal from 'sweetalert2';
import api from '../config/axios';

function Login() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // ✅ fadeOut이 true일 때 body overflow를 잠시 제거
  useEffect(() => {
    if (fadeOut) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = ''; // 복구
    };
  }, [fadeOut]);

  const handleNavigate = (path) => {
    setFadeOut(true);
    setTimeout(() => navigate(path), 300);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/api/users/login', {
        userId: id,
        password: password,
      });

      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      Swal.fire({
        title: '로그인 완료!',
        text: '환영합니다 😊',
        icon: 'success',
        confirmButtonColor: '#ffa158',
        confirmButtonText: '확인',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        // ✅ 전환 직전에 스크롤바 제거
        document.body.style.overflow = 'hidden';
        setFadeOut(true);

        setTimeout(() => {
          document.body.style.overflow = ''; // 메인 진입 후 복구
          navigate('/main');
        }, 300);
      });
    } catch (error) {
      Swal.fire({
        title: '로그인 실패!',
        text:
          error.response?.data?.message ||
          '아이디 또는 비밀번호를 확인해주세요.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: '확인',
      });
    }
  };

  return (
    <div className={`Login ${fadeOut ? 'fade-out' : ''}`}>
      <div className="login-container">
        <button
          className="login-back-button"
          onClick={() => window.history.back()}
        >
          ←
        </button>
        <div className="character-logo">
          <img
            src={loginCharacter}
            alt="milo 캐릭터"
            className="character1"
            onClick={() => handleNavigate('/')} // ✅ 클릭 시 스플래시로 이동
            style={{ cursor: 'pointer' }}
          />
          <h2
            className="logo1"
            onClick={() => handleNavigate('/')} // ✅ 클릭 시 스플래시로 이동
            style={{ cursor: 'pointer' }}
          >
            Milo.
          </h2>
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
            |{' '}
            <span onClick={() => handleNavigate('/find-password')}>
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
