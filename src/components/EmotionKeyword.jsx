import React from 'react';
import '../styles/EmotionKeyword.css';

const EmotionKeyword = () => {
  const keywords = ['우울', '불안', '답답함'];
  return (
    <div className="keyword-wrapper">
      <h3 className="keyword-title">오늘의 감정 키워드</h3>
      <div className="keyword-tags">
        {keywords.map((word, idx) => (
          <span key={idx} className="keyword-tag">
            #{word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default EmotionKeyword;
