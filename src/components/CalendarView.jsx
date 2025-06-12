import React, { useState } from 'react';
import '../styles/CalendarSection.css';

const CalendarView = () => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth(); // 0-indexed

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= lastDate; i++) days.push(i);

  const handlePrevMonth = () => {
    const newDate = new Date(viewDate.setMonth(month - 1));
    setViewDate(new Date(newDate));
  };

  const handleNextMonth = () => {
    const newDate = new Date(viewDate.setMonth(month + 1));
    setViewDate(new Date(newDate));
  };

  const isToday = (day) =>
    day === today.getDate() &&
    today.getMonth() === month &&
    today.getFullYear() === year;

  return (
    <div className="calendar-view">
      <div className="calendar-nav">
        <button className="nav-button" onClick={handlePrevMonth}>
          ◀
        </button>
        <div className="calendar-title">
          {viewDate.toLocaleString('en-US', { month: 'long' })} {year}
        </div>
        <button className="nav-button" onClick={handleNextMonth}>
          ▶
        </button>
      </div>

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
        {days.map((day, idx) => (
          <span key={idx} className={isToday(day) ? 'selected' : ''}>
            {day ? day : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
