// src/components/CalendarView.jsx
import React from 'react';
import '../styles/CalendarView.css';

const CalendarView = () => {
  // 임시 하드코딩된 달력. 후에 react-calendar 또는 커스텀 구성 추천
  return (
    <div className="calendar-view">
      <div className="calendar-weekdays">
        <span>일</span>
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span>토</span>
      </div>
      <div className="calendar-days">
        {[27, 28, 29, 30, 1, 2, 3].map((day, idx) => (
          <span key={idx} className={day === 1 ? 'selected' : ''}>
            {day}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
