// src/components/CalendarToggle.jsx
import React from 'react';
import '../styles/CalendarToggle.css';

const CalendarToggle = ({ isOpen, onToggle }) => (
  <div className="calendar-toggle">
    <button onClick={onToggle} className="calendar-button">
      📅
    </button>
    <span>1&nbsp;&nbsp;&nbsp;&nbsp;May / 2025</span>
  </div>
);

export default CalendarToggle;
