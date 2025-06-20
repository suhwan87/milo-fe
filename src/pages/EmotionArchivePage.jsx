// src/pages/EmotionArchivePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';

import '../styles/EmotionArchivePage.css';

import joyIcon from '../assets/icons/joy.png';
import stableIcon from '../assets/icons/stable.png';
import anxietyIcon from '../assets/icons/anxiety.png';
import sadnessIcon from '../assets/icons/sadness.png';
import angerIcon from '../assets/icons/anger.png';
import summaryIcon from '../assets/icons/summary.png';
import EmotionRadarChart from '../components/EmotionRadarChart';

/* 감정명 → 아이콘 */
const iconMap = {
  JOY: joyIcon,
  SADNESS: sadnessIcon,
  ANXIETY: anxietyIcon,
  ANGER: angerIcon,
  STABLE: stableIcon,
};
const korToEng = {
  기쁨: 'JOY',
  슬픔: 'SADNESS',
  불안: 'ANXIETY',
  분노: 'ANGER',
  안정: 'STABLE',
};
const getIcon = (e) => iconMap[korToEng[e] || e] || stableIcon;

const EmotionArchivePage = () => {
  const navigate = useNavigate();
  const today = new Date();
  const thisMonth = new Date(today.getFullYear(), today.getMonth());

  const [viewMonth, setViewMonth] = useState(thisMonth);
  const [records, setRecords] = useState([]); // {day,icon,label}[]
  const scrollRef = useRef(null); // 가로 스크롤 div

  /* ───────────────── 월별 데이터 로딩 ───────────────── */
  useEffect(() => {
    const fetch = async () => {
      const ym = `${viewMonth.getFullYear()}-${String(viewMonth.getMonth() + 1).padStart(2, '0')}`;
      const token = localStorage.getItem('accessToken');
      try {
        const { data } = await api.get(`/api/report/records?month=${ym}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = data
          .sort((a, b) => new Date(a.date) - new Date(b.date)) // 날짜 오름차순
          .map((v) => ({
            day: new Date(v.date).getDate(),
            icon: getIcon(v.mainEmotion),
            label: v.mainEmotion,
          }));
        setRecords(list);
      } catch (e) {
        console.error('기록 조회 실패:', e);
        setRecords([]);
      }
    };
    fetch();
  }, [viewMonth]);

  /* ── 최신 5개가 먼저 보이도록 스크롤을 우측 끝으로 ── */
  useEffect(() => {
    const box = scrollRef.current;
    if (!box) return;
    setTimeout(() => {
      box.scrollLeft = box.scrollWidth - box.clientWidth;
    }, 0);
  }, [records]);

  /* ── 데스크톱 grab-scroll 이벤트 ── */
  useEffect(() => {
    const box = scrollRef.current;
    if (!box) return;

    let isDown = false,
      startX = 0,
      startScroll = 0;
    const down = (e) => {
      isDown = true;
      box.classList.add('dragging');
      startX = e.pageX;
      startScroll = box.scrollLeft;
    };
    const move = (e) => {
      if (!isDown) return;
      e.preventDefault();
      box.scrollLeft = startScroll - (e.pageX - startX);
    };
    const up = () => {
      isDown = false;
      box.classList.remove('dragging');
    };

    box.addEventListener('mousedown', down);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      box.removeEventListener('mousedown', down);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, []);

  /* ── 월 네비게이션 ── */
  const shiftMonth = (delta) => {
    const m = new Date(viewMonth);
    m.setMonth(viewMonth.getMonth() + delta);
    if (delta > 0 && m > thisMonth) return; // 미래 차단
    setViewMonth(m);
  };
  const monthLabel = viewMonth.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
  const disableNext =
    viewMonth.getFullYear() === thisMonth.getFullYear() &&
    viewMonth.getMonth() === thisMonth.getMonth();

  return (
    <div className="archive-page-container">
      {/* 헤더 */}
      <div className="archive-page-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <h2>감정 아카이브</h2>
      </div>

      {/* 월 선택 */}
      <div className="archive-page-month-selector">
        <span className="arrow" onClick={() => shiftMonth(-1)}>
          ‹
        </span>
        <span className="month-text">{monthLabel}</span>
        <span
          className={`arrow ${disableNext ? 'disabled' : ''}`}
          onClick={() => shiftMonth(1)}
        >
          ›
        </span>
      </div>

      {/* 기록 줄 */}
      <div className="archive-page-record-section">
        <div className="archive-page-record-header">
          <span className="record-title">이번달 기록</span>
          <span className="record-count">
            이번달 총 기록:{' '}
            <span className="highlight">{records.length}번</span>
          </span>
        </div>

        <div className="record-track">
          <span className="track-line" />

          {/* 🔑 가로 스크롤 · grab 드래그 */}
          <div className="icon-scroll" ref={scrollRef}>
            {records.map((r, idx) => (
              <div key={idx} className="record-item">
                <img src={r.icon} alt={r.label} draggable={false} />
                <span>{r.day}</span>
              </div>
            ))}
          </div>

          <span className="record-total">{records.length}</span>
        </div>
      </div>

      {/* 감정 분포 */}
      <h3 className="emotion-archive-title">감정 분포</h3>
      <div className="emotion-archive-section">
        <div className="emotion-chart-wrapper">
          <EmotionRadarChart />
        </div>
      </div>

      {/* 총평 예시 */}
      <h3 className="emotion-archive-title">이번달 총평</h3>
      <div className="archive-page-summary">
        <img
          src={summaryIcon}
          alt="총평"
          className="archive-page-summary-icon"
        />
        <p className="archive-page-summary-text">
          이번 달은 슬픔과 불안이 자주 나타났지만, 중순 이후 회복 흐름이
          보였습니다.
        </p>
      </div>
    </div>
  );
};

export default EmotionArchivePage;
