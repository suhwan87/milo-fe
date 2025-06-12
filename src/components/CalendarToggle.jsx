// src/components/CalendarToggle.jsx
import React from 'react';
import '../styles/CalendarSection.css';

const CalendarToggle = ({ isOpen, onToggle }) => {
  const today = new Date();

  const day = today.getDate();
  const month = today.toLocaleString('en-US', { month: 'short' });
  const year = today.getFullYear();

  return (
    <div className="calendar-toggle-bar" onClick={onToggle}>
      <div className="calendar-toggle-info">
        <span className="calendar-toggle-day">{day}</span>
        <span className="calendar-toggle-month">
          {month} / {year}
        </span>
      </div>

      {/* 기존 버튼 삭제해도 되고 남겨도 됨 (비주얼만 유지 가능) */}
      <div className="calendar-fab" role="button" aria-label="calendar icon">
        📅
      </div>
    </div>
  );
};

export default CalendarToggle;
