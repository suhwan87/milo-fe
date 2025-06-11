import React from 'react';
import '../styles/EmotionKeyword.css';
import bookIcon from '../assets/icons/report_image.png';

const EmotionKeyword = () => {
  const keywords = ['우울', '불안'];

  return (
    <div className="report-section">
      <div className="report-header">
        <span className="report-title">분석 리포트</span>
        <span className="report-arrow">›</span>
      </div>

      <div className="report-keyword-title">
        <div className="title-row">
          <img src={bookIcon} alt="아이콘" className="icon" />
          <span>오늘의 감정 키워드</span>
        </div>

        <div className="keyword-list">
          {keywords.map((word, idx) => (
            <span key={idx} className="keyword-badge">
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="report-description">
        오늘 대화에서 마일로가 감정을 분석해 요약해줘요
      </div>
    </div>
  );
};

export default EmotionKeyword;
