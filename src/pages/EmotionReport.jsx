import React, { useState, useEffect, useRef } from 'react';
import ReportHeader from '../components/ReportHeader';
import EmotionTag from '../components/EmotionTag';
import ReportCard from '../components/ReportCard';
import CalendarToggle from '../components/CalendarToggle';
import CalendarView from '../components/CalendarView';
import '../styles/EmotionReport.css';
import '../styles/CalendarSection.css';
import api from '../config/axios';
import EmptyIcon from '../assets/characters/crying-character.png';
import LoadingIcon from '../assets/characters/login-character.png';

/* 🔄 월 키(YYYY-MM) 헬퍼 ─ UTC 변환 없이 로컬 값 그대로 사용 */
const getMonthKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const EmotionReport = () => {
  const [isCalendarOpen, setCalendarOpen] = useState(false);
  const [report, setReport] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reportDays, setReportDays] = useState([]); // 해당 월 리포트 일(day) 배열
  const [viewMonth, setViewMonth] = useState(new Date()); // 현재 캘린더에 표시 중인 달

  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [pollingToken, setPollingToken] = useState(0); // ✅ 새 토큰
  const pollingTokenRef = useRef(0);

  const MAX_RETRY = 5;
  const RETRY_INTERVAL = 1000; // 1초

  /** ✅ 특정 날짜의 리포트 조회 */
  const fetchReport = async (dateObj, token) => {
    const date = dateObj.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    const isToday = date === today;

    const userId = localStorage.getItem('userId');
    const lastChatEnd = localStorage.getItem(`lastChatEnd_${userId}`);
    const lastEnd = parseInt(lastChatEnd, 10);
    const accessToken = localStorage.getItem('token');

    try {
      const res = await api.get(`/api/report/daily?date=${date}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const reportData = res.data;
      const createdAt = new Date(reportData.createdAt).getTime();

      if (pollingTokenRef.current !== token) return; // ✅ 토큰이 다르면 무시

      if (
        isToday &&
        lastChatEnd &&
        createdAt <= lastEnd &&
        retryCount < MAX_RETRY
      ) {
        setLoading(true);
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          fetchReport(dateObj, token);
        }, RETRY_INTERVAL);
      } else {
        setReport(reportData);
        setNotFound(false);
        setLoading(false);
      }
    } catch (err) {
      if ([400, 404].includes(err.response?.status)) {
        if (isToday && lastChatEnd && retryCount < MAX_RETRY) {
          // ✅ 오늘이고, 리포트는 아직 없음 (예: 채팅 직후)
          setLoading(true);
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            fetchReport(dateObj, token); // 🔥 token 포함 중요
          }, RETRY_INTERVAL);
        } else {
          // ✅ 과거나 retry 초과 → 진짜 리포트 없음
          setNotFound(true);
          setReport(null);
          setLoading(false);
        }
      }
    }
  };

  /** ✅ 해당 월의 리포트 존재 일자 조회 - 레이스컨디션 & 시차 해결 */
  const fetchReportDays = (() => {
    let controller; // 🔄 요청 취소용 AbortController
    return async (dateObj) => {
      const ym = getMonthKey(dateObj); // 🔄 로컬 기준 YYYY-MM
      const token = localStorage.getItem('token');

      controller?.abort(); // 이전 요청 취소
      controller = new AbortController();

      try {
        const { data } = await api.get(`/api/report/days?month=${ym}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        /* 🔄 여전히 사용자가 보고 있는 달일 때만 반영 */
        if (ym === getMonthKey(viewMonth)) {
          setReportDays(data.map(Number)); // 문자열 → 숫자
        }
      } catch (err) {
        if (err.name !== 'CanceledError') {
          console.error('📅 월간 리포트 날짜 조회 실패:', err);
          if (ym === getMonthKey(viewMonth)) setReportDays([]);
        }
      }
    };
  })();

  /* 날짜 선택 → 일일 리포트 요청 */
  useEffect(() => {
    setNotFound(false);
    setLoading(false); // 즉시 로딩 종료
    const newToken = pollingToken + 1;
    setPollingToken(newToken);
    pollingTokenRef.current = newToken;
    setRetryCount(0);
    fetchReport(selectedDate, newToken);
  }, [selectedDate]);

  /* 월 전환 → 월간 리포트 일자 요청 */
  useEffect(() => {
    fetchReportDays(viewMonth);
  }, [viewMonth]); // viewMonth가 변할 때마다

  return (
    <div className="report-container">
      <ReportHeader />

      {/* 리포트 유무 */}
      {notFound ? (
        <div className="no-report-view">
          <img src={EmptyIcon} alt="분석 없음" className="no-report-image" />
          <p className="no-report-text">작성된 분석 리포트가 없어요</p>
        </div>
      ) : loading ? (
        <div className="no-report-view">
          <img src={LoadingIcon} alt="분석 없음" className="no-report-image" />
          <p className="loading-text">
            리포트를 작성 중입니다
            <span className="dot-animate" />
          </p>
        </div>
      ) : report ? (
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
      ) : null}

      {/* 캘린더 오버레이 */}
      {isCalendarOpen && (
        <div
          className="calendar-overlay"
          onClick={() => setCalendarOpen(false)}
        />
      )}

      {/* 슬라이딩 캘린더 */}
      <div className={`calendar-slide-wrapper ${isCalendarOpen ? 'open' : ''}`}>
        <div className="calendar-slide">
          <CalendarToggle
            isOpen={isCalendarOpen}
            onToggle={() => setCalendarOpen(!isCalendarOpen)}
            selectedDate={selectedDate}
          />
          <CalendarView
            onDateSelect={setSelectedDate}
            selectedDate={selectedDate}
            reportDays={reportDays}
            viewDate={viewMonth}
            onMonthChange={setViewMonth}
          />
        </div>
      </div>
    </div>
  );
};

export default EmotionReport;
