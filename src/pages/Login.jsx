// 로그인 페이지
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import loginCharacter from '../assets/characters/login-character.png';
import Swal from 'sweetalert2';
import api from '../config/axios';
import KakaoLoginButton from '../components/KakaoLoginButton'; // 경로는 실제 위치에 따라 수정

function Login() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  // 페이지 전환 애니메이션 시 스크롤 방지
  useEffect(() => {
    if (fadeOut) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = ''; // 복구
    };
  }, [fadeOut]);

  // 라우팅 핸들러 (페이드아웃 후 이동)
  const handleNavigate = (path) => {
    setFadeOut(true);
    setTimeout(() => navigate(path), 300);
  };

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 기본 제출 방지

    try {
      // 로그인 요청
      const response = await api.post('/api/users/login', {
        userId: id,
        password: password,
      });

      // 로그인 성공 시 토큰 및 ID 저장
      const { token, userId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      // 성공 메시지 표시 후 메인으로 전환
      Swal.fire({
        title: '로그인 완료!',
        text: '환영합니다 😊',
        icon: 'success',
        confirmButtonColor: '#ffa158',
        confirmButtonText: '확인',
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        // 전환 직전에 스크롤바 제거
        document.body.style.overflow = 'hidden';
        setFadeOut(true);

        setTimeout(() => {
          document.body.style.overflow = ''; // 메인 진입 후 복구
          navigate('/main');
        }, 300);
      });
    } catch (error) {
      // 로그인 실패 처리
      Swal.fire({
        title: '로그인 실패!',
        text:
          error.response?.data?.message ||
          '아이디 또는 비밀번호를 확인해 주세요.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: '확인',
      });
    }
  };

  // 카카오 로그인 성공 시 처리
  const handleKakaoLoginSuccess = (token, userId, nickname) => {
    Swal.fire({
      title: '로그인 완료!',
      text: '환영합니다 😊',
      icon: 'success',
      confirmButtonColor: '#ffa158',
      confirmButtonText: '확인',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(() => {
      document.body.style.overflow = 'hidden';
      setFadeOut(true);
      setTimeout(() => {
        document.body.style.overflow = '';
        if (nickname === '카카오유저') {
          navigate('/change-nickname');
        } else {
          navigate('/main');
        }
      }, 300);
    });
  };

  return (
    <div className={`Login ${fadeOut ? 'fade-out' : ''}`}>
      <div className="login-container">
        {/* Milo 로고 및 캐릭터 클릭 시 → Splash 페이지 이동 */}
        <div className="character-logo">
          <img
            src={loginCharacter}
            alt="milo 캐릭터"
            className="character1"
            onClick={() => handleNavigate('/')}
            style={{ cursor: 'pointer' }}
          />
          <h2
            className="logo1"
            onClick={() => handleNavigate('/')}
            style={{ cursor: 'pointer' }}
          >
            Milo.
          </h2>
        </div>

        {/* 로그인 입력 폼 */}
        <form className="login-form" onSubmit={handleLogin}>
          아이디
          <input
            type="text"
            placeholder="아이디를 입력해 주세요"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          비밀번호
          <input
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* 아이디 / 비밀번호 찾기 라우팅 */}
          <div className="find-info">
            <span onClick={() => handleNavigate('/find-id')}>아이디 찾기</span>{' '}
            |{' '}
            <span onClick={() => handleNavigate('/find-password')}>
              비밀번호 찾기
            </span>
          </div>
          {/* 로그인 버튼 */}
          <button type="submit">Login</button>
        </form>
        {/* 회원가입 안내 */}
        <p className="login-footer">
          아직 계정이 없으신가요?{' '}
          <span onClick={() => handleNavigate('/signup')}>Signup</span>
        </p>
        {/* 구분선 + 또는 */}
        <div className="divider-container">
          <hr className="divider-line" />
          <span className="divider-text">또는</span>
          <hr className="divider-line" />
        </div>
        {/* 카카오 로그인 버튼 */}
        <KakaoLoginButton onSuccess={handleKakaoLoginSuccess} />
      </div>
    </div>
  );
}

export default Login;
