// src/pages/EmotionArchivePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import '../styles/EmotionArchivePage.css';

import joyIcon from '../assets/icons/joy.png';
import stableIcon from '../assets/icons/stable.png';
import anxietyIcon from '../assets/icons/anxiety.png';
import sadnessIcon from '../assets/icons/sadness.png';
import angerIcon from '../assets/icons/anger.png';
import summaryIcon from '../assets/icons/summary.png';
import EmotionRadarChart from '../components/EmotionRadarChart';

const variants = {
  enter: (direction) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -100 : 100, opacity: 0 }),
};

const EmotionArchivePage = () => {
  const navigate = useNavigate();
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth());

  const [currentDate, setCurrentDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth())
  );
  const [direction, setDirection] = useState(0);

  const handlePrevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(currentDate.getMonth() - 1);
    setDirection(-1);
    setCurrentDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(currentDate.getMonth() + 1);
    if (next > thisMonth) return;
    setDirection(1);
    setCurrentDate(next);
  };

  const getFormattedMonth = (date) =>
    date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  const isNextDisabled =
    currentDate.getFullYear() === thisMonth.getFullYear() &&
    currentDate.getMonth() === thisMonth.getMonth();

  const emotionRecords = [
    { day: 5, icon: sadnessIcon, label: '슬픔' },
    { day: 7, icon: joyIcon, label: '기쁨' },
    { day: 8, icon: anxietyIcon, label: '불안' },
    { day: 10, icon: angerIcon, label: '분노' },
    { day: 11, icon: stableIcon, label: '안정' },
  ];

  return (
    <div className="archive-page-container">
      <div className="archive-page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2>감정 아카이브</h2>
      </div>

      <div className="archive-page-month-selector">
        <span className="arrow" onClick={handlePrevMonth}>
          ‹
        </span>
        <span className="month-text">{getFormattedMonth(currentDate)}</span>
        <span
          className={`arrow ${isNextDisabled ? 'disabled' : ''}`}
          onClick={handleNextMonth}
        >
          ›
        </span>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentDate.getFullYear() + '-' + currentDate.getMonth()}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35 }}
        >
          <div className="archive-page-record-section">
            <div className="archive-page-record-header">
              <span className="record-title">이번달 기록</span>
              <span className="record-count">
                이번달 총 기록:{' '}
                <span className="highlight">{emotionRecords.length}번</span>
              </span>
            </div>
            <div className="archive-page-record-line">
              {emotionRecords.map((record, idx) => (
                <div key={idx} className="record-item">
                  <img src={record.icon} alt={record.label} />
                  <span>{record.day}</span>
                </div>
              ))}
              <div className="record-total">{emotionRecords.length}</div>
            </div>
          </div>

          {/* 감정 분포 섹션 */}
          <h3 className="emotion-archive-title">감정 분포</h3>
          <div className="emotion-archive-section">
            <div className="emotion-chart-wrapper">
              <EmotionRadarChart />
            </div>
          </div>

          <h3 className="emotion-archive-title">이번달 총평</h3>
          <div className="archive-page-summary">
            <img
              src={summaryIcon}
              alt="총평 아이콘"
              className="archive-page-summary-icon"
            />
            <p className="archive-page-summary-text">
              이번 달은 슬픔과 불안이 자주 나타났지만, 중순 이후 회복 흐름이
              보였습니다.
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EmotionArchivePage;
