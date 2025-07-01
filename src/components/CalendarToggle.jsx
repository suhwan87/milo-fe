// 캘린더 토글 컴포넌트
import React from 'react';
import '../styles/CalendarSection.css';

// 날짜 정보(일/월/년)를 보여주며 클릭 시 캘린더 슬라이드 토글
const CalendarToggle = ({ isOpen, onToggle, selectedDate }) => {
  const day = selectedDate.getDate();
  const month = selectedDate.toLocaleString('en-US', { month: 'short' });
  const year = selectedDate.getFullYear();

  return (
    <div className="calendar-toggle-bar" onClick={onToggle}>
      <div className="calendar-toggle-info">
        <span className="calendar-toggle-day">{day}</span>
        <span className="calendar-toggle-month">
          {month} / {year}
        </span>
      </div>
      <div className="calendar-fab" role="button" aria-label="calendar icon">
        📅
      </div>
    </div>
  );
};

export default CalendarToggle;
