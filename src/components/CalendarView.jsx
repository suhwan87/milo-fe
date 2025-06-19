import React, { useState } from 'react';
import '../styles/CalendarSection.css';

const CalendarView = ({ onDateSelect, selectedDate }) => {
  const today = new Date();
  today.setHours(12);
  const [viewDate, setViewDate] = useState(new Date(today));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

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
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
    next.setHours(0, 0, 0, 0);

    // 오늘 이후 달로 못 넘어가게 제한
    const todayMonth = today.getFullYear() * 12 + today.getMonth();
    const nextMonth = next.getFullYear() * 12 + next.getMonth();

    if (nextMonth <= todayMonth) {
      setViewDate(next);
    }
  };

  const isSelected = (day) =>
    selectedDate &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === month &&
    selectedDate.getFullYear() === year;

  const handleDateClick = (day) => {
    if (!day) return;
    const date = new Date(year, month, day);
    date.setHours(12);
    onDateSelect(date);
  };

  return (
    <div className="calendar-view">
      <div className="calendar-nav">
        <button className="nav-button" onClick={handlePrevMonth}>
          ◀
        </button>
        <div className="calendar-title">
          {viewDate.toLocaleString('en-US', { month: 'long' })} {year}
        </div>
        <button
          className="nav-button"
          onClick={handleNextMonth}
          disabled={
            viewDate.getFullYear() === today.getFullYear() &&
            viewDate.getMonth() === today.getMonth()
          }
        >
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
          <span
            key={idx}
            className={isSelected(day) ? 'selected' : ''}
            onClick={() => handleDateClick(day)}
          >
            {day || ''}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
