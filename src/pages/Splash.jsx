import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Splash.css';
import splashCharacter from '../assets/characters/splash-character.png';

function Splash() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  // ✅ Splash가 보여질 때 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = 'hidden'; // 스크롤 제거
    return () => {
      document.body.style.overflow = ''; // 스크롤 원상 복구
    };
  }, []);

  const handleStart = () => {
    setFadeOut(true);
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  return (
    <div className={`splash ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-header">
        <h1 className="logo">Milo.</h1>
        <svg
          className="arch-svg"
          viewBox="0 0 390 100"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C130,30 260,30 390,100 L390,100 L0,100 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      <div className="splash-text">
        <p>
          당신의 감정을 들려주세요
          <br />
          milo가 함께 할게요
        </p>
        <button onClick={handleStart}>지금 시작하기</button>
      </div>

      <img src={splashCharacter} alt="milo 캐릭터" className="character" />
    </div>
  );
}

export default Splash;
