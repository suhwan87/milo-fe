import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Splash.css"; // CSS 따로 분리

function Splash() {
  const navigate = useNavigate();

  return (
    <div className="splash">
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
        <button onClick={() => navigate("/login")}>지금 시작하기</button>
      </div>

      <img
        src="/assets/milo_character.png"
        alt="milo 캐릭터"
        className="character"
      />
    </div>
  );
}

export default Splash;
