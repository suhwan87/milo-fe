// 분석 요약, 피드백, 응원의 한마디 공통 컴포넌트
import React from 'react';
import '../styles/ReportCard.css';

const ReportCard = ({ text }) => (
  <div className="report-card">
    <div className="card-text">{text}</div>
  </div>
);

export default ReportCard;
