// 분석 리포트 페이지 헤더 컴포넌트
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ReportHeader.css';

const ReportHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="report-header">
      <button onClick={() => navigate(-1)} className="back-button">
        ←
      </button>
      <h2>분석 리포트</h2>
    </div>
  );
};

export default ReportHeader;
