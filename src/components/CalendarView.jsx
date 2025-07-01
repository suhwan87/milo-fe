// 월 단위 달력 뷰 컴포넌트
import React from 'react';
import '../styles/CalendarSection.css';

const CalendarView = ({
  onDateSelect,
  selectedDate,
  reportDays,
  viewDate,
  onMonthChange,
}) => {
  const today = new Date();
  today.setHours(12); // 비교를 위해 정오 기준으로 설정

  // 현재 달 정보
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 달력에 표시할 일자 배열 구성 (빈칸 + 날짜)
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= lastDate; i++) days.push(i);

  // 이전 달 이동
  const handlePrevMonth = () => onMonthChange(new Date(year, month - 1, 1));

  // 다음 달 이동 (오늘 기준 이후는 비활성화)
  const handleNextMonth = () => {
    const next = new Date(year, month + 1, 1);
    const todayKey = today.getFullYear() * 12 + today.getMonth();
    const nextKey = next.getFullYear() * 12 + next.getMonth();
    if (nextKey <= todayKey) onMonthChange(next);
  };

  // 선택된 날짜 여부
  const isSelected = (day) =>
    day &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === month &&
    selectedDate.getFullYear() === year;

  // 리포트 있는 날짜 표시 여부 (선택된 날은 제외)
  const isMarked = (day) => day && reportDays.includes(day) && !isSelected(day);

  // 날짜 클릭 시 선택 처리
  const handleDateClick = (day) => {
    if (!day) return;
    const date = new Date(year, month, day);
    date.setHours(12);
    onDateSelect(date);
  };

  return (
    <div className="calendar-view">
      {/* 네비게이션 */}
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

      {/* 요일 헤더 */}
      <div className="calendar-weekdays">
        <span>일</span>
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span>토</span>
      </div>

      {/* 날짜 그리드 */}
      <div className="calendar-days">
        {days.map((day, idx) => (
          <span
            key={idx}
            className={`${isSelected(day) ? 'selected' : ''} ${isMarked(day) ? 'marked' : ''}`}
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
