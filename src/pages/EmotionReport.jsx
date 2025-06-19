import React, { useState, useEffect } from 'react';
import ReportHeader from '../components/ReportHeader';
import EmotionTag from '../components/EmotionTag';
import ReportCard from '../components/ReportCard';
import CalendarToggle from '../components/CalendarToggle';
import CalendarView from '../components/CalendarView';
import '../styles/EmotionReport.css';
import '../styles/CalendarSection.css';
import api from '../config/axios';
import EmptyIcon from '../assets/characters/crying-character.png';

const EmotionReport = () => {
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [report, setReport] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchReport = async (dateObj) => {
    try {
      const date = dateObj.toISOString().split('T')[0];
      const token = localStorage.getItem('accessToken');

      const response = await api.get(`/api/report/daily?date=${date}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReport(response.data);
      setNotFound(false);
    } catch (error) {
      const status = error.response?.status;

      if (status === 404 || status === 400) {
        setNotFound(true);
        setReport(null);
        // 👉 예상된 상황이므로 콘솔 출력 안 함
      } else {
        console.error('리포트 요청 실패:', error); // 예상 못한 오류만 출력
      }
    }
  };

  useEffect(() => {
    fetchReport(selectedDate);
  }, [selectedDate]);

  return (
    <div className="report-container">
      <ReportHeader />

      {notFound ? (
        <div className="no-report-view">
          <img src={EmptyIcon} alt="분석 없음" className="no-report-image" />
          <p className="no-report-text">작성된 분석 리포트가 없어요</p>
        </div>
      ) : (
        report && (
          <div className="emotion-info">
            <p className="section-title">나의 감정</p>
            <EmotionTag text={`#${report.mainEmotion}`} />

            <p className="section-title">나의 기록</p>

            <div className="report-block">
              <div className="report-label">요약</div>
              <ReportCard text={report.summary} />
            </div>
            <div className="report-block">
              <div className="report-label">제안</div>
              <ReportCard text={report.feedback} />
            </div>
            <div className="report-block">
              <div className="report-label">응원의 한마디</div>
              <ReportCard text={report.encouragement} />
            </div>
          </div>
        )
      )}

      {isCalendarOpen && (
        <div
          className="calendar-overlay"
          onClick={() => setCalendarOpen(false)}
        />
      )}

      <div className={`calendar-slide-wrapper ${isCalendarOpen ? 'open' : ''}`}>
        <div className="calendar-slide">
          <CalendarToggle
            isOpen={isCalendarOpen}
            onToggle={() => setCalendarOpen(!isCalendarOpen)}
            selectedDate={selectedDate} // ✅ 전달
          />
          <CalendarView
            onDateSelect={(date) => setSelectedDate(date)}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
};

export default EmotionReport;
