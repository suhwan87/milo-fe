// src/pages/EmotionReport.jsx
import React, { useState } from 'react';
import ReportHeader from '../components/ReportHeader';
import EmotionTag from '../components/EmotionTag';
import ReportCard from '../components/ReportCard';
import CalendarToggle from '../components/CalendarToggle';
import CalendarView from '../components/CalendarView';
import '../styles/EmotionReport.css';
import '../styles/CalendarSection.css';

const EmotionReport = () => {
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="report-container">
      <ReportHeader />

      <div className="emotion-info">
        <p className="section-title">나의 감정</p>
        <EmotionTag text="#불안" />
        <p className="section-title">나의 기록</p>

        <div className="report-block">
          <div className="report-label">요약</div>
          <ReportCard
            text={`작은 일에도 마음이 자주 흔들리고,\n실수에 대한 걱정이 컸어요.\n내가 너무 예민한 건 아닐까 스스로를 자책하는 모습도 보였어요.`}
          />
        </div>
        <div className="report-block">
          <div className="report-label">제안</div>
          <ReportCard
            text={`불안한 감정을 없애려 하기보단,\n이 감정을 조용히 받아들이는 연습부터 시작해보세요.\n“괜찮아”라는 말을 오늘 하루에 한 번, 나에게 건네보면 어떨까요?`}
          />
        </div>
        <div className="report-block">
          <div className="report-label">응원의 한마디</div>
          <ReportCard
            text={`불안한 날도, 힘겨운 순간도 모두 당신의 일부예요.\n지금처럼 느끼고 있다는 것만으로도, 이미 잘하고 있어요.`}
          />
        </div>
      </div>

      {isCalendarOpen && (
        <div
          className="calendar-overlay"
          onClick={() => setCalendarOpen(false)}
        />
      )}

      {/* ✅ 하단 슬라이드: 토글+달력 한 몸 구성 */}
      <div className={`calendar-slide-wrapper ${isCalendarOpen ? 'open' : ''}`}>
        <div className="calendar-slide">
          <CalendarToggle
            isOpen={isCalendarOpen}
            onToggle={() => setCalendarOpen(!isCalendarOpen)}
          />
          <CalendarView />
        </div>
      </div>
    </div>
  );
};

export default EmotionReport;
