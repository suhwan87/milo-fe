// src/components/EmotionArchive.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmotionArchive.css';
import archiveCharacter from '../assets/characters/main3-character.png';

const EmotionArchive = () => {
  const navigate = useNavigate();

  return (
    <div
      className="archive-section"
      onClick={() => navigate('/emotion-archive')}
    >
      <div className="archive-header">
        <span className="archive-title">감정 아카이브</span>
        <span className="archive-arrow">›</span>
      </div>

      <div className="archive-content">
        <div className="archive-title-row">
          <img
            src={archiveCharacter}
            alt="감정 캐릭터"
            className="archive-icon"
          />
          <div className="archive-texts">
            <p className="archive-bold">이번 달 채팅 8회!</p>
            <p className="archive-sub">꾸준히 기록해주셔서 고마워요 😊</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionArchive;
