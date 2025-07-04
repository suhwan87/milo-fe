import React from 'react';
import kakaoLogo from '../assets/icons/kakao_logo.png';
import '../styles/KakaoLoginButton.css';

const KakaoLoginButton = ({ onSuccess }) => {
  const handleLogin = () => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('36450eb9b918b686522d413a6d549f6f');
    }

    window.Kakao.Auth.login({
      scope: 'profile_nickname',
      success: function (authObj) {
        const accessToken = authObj.access_token;

        const backendBaseUrl =
          window.location.hostname === 'localhost'
            ? 'http://localhost:8085'
            : 'http://211.188.59.173:8085';

        fetch(`${backendBaseUrl}/oauth/kakao`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken }),
        })
          .then((res) => res.json())
          .then((data) => {
            const { token, userId, nickname } = data;

            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);

            if (onSuccess) {
              onSuccess(token, userId, nickname); // ✅ nickname도 넘겨줌!
            }
          })
          .catch((err) => {
            console.error('카카오 로그인 실패:', err);
          });
      },
      fail: function (err) {
        console.error('카카오 인증 실패:', err);
      },
    });
  };

  return (
    <button className="kakao-login-button" onClick={handleLogin}>
      <img src={kakaoLogo} alt="kakao" className="kakao-logo" />
      <span className="kakao-text">카카오톡으로 로그인</span>
    </button>
  );
};

export default KakaoLoginButton;
