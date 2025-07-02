// 메인 화면 분석 리포트 섹션 컴포넌트
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EmotionKeyword.css';
import bookIcon from '../assets/icons/report_image.png';
import api from '../config/axios';

const EmotionKeyword = () => {
  const [keywords, setKeywords] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const MAX_RETRY = 5;
    const RETRY_INTERVAL = 1500;

    // 오늘 날짜, 토큰, 유저 정보 및 마지막 채팅 종료 시간 가져오기
    const today = new Date().toISOString().split('T')[0];
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const lastChatEnd = parseInt(
      localStorage.getItem(`lastChatEnd_${userId}`),
      10
    );
    const now = Date.now();

    let retryCount = 0;
    let timeoutId;

    // 오늘 리포트 요청 함수
    const fetchTodayReport = async () => {
      setLoading(true);

      if (!token) {
        setLoading(false);
        return;
      }

      // 오늘 날짜 기준 리포트 요청
      try {
        const res = await api.get(`/api/report/daily?date=${today}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const report = res.data;
        const mainEmotion = report.mainEmotion;
        const createdAt = new Date(report.createdAt).getTime();

        if (mainEmotion && (!lastChatEnd || createdAt > lastChatEnd)) {
          setKeywords([mainEmotion]);
          setNotFound(false);
          setLoading(false);
          return;
        } else {
          const justFinishedChat = lastChatEnd && now - lastChatEnd < 10000;
          if (justFinishedChat && retryCount < MAX_RETRY) {
            if (retryCount === 0) setLoading(true);
            retryCount++;
            timeoutId = setTimeout(fetchTodayReport, RETRY_INTERVAL);
            return;
          } else {
            setNotFound(true);
            setLoading(false);
          }
        }
      } catch (err) {
        if (err.response?.status === 404) {
          const justFinishedChat = lastChatEnd && now - lastChatEnd < 10000;
          if (justFinishedChat && retryCount < MAX_RETRY) {
            retryCount++;
            setLoading(true);
            timeoutId = setTimeout(fetchTodayReport, RETRY_INTERVAL);
            return;
          } else {
            setNotFound(true);
          }
        }
        setLoading(false);
      }
    };

    fetchTodayReport();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // 카드 클릭 시 리포트 상세 페이지로 이동
  const handleClick = () => {
    navigate('/emotion-report');
  };

  return (
    <div className="report-section card-section" onClick={handleClick}>
      <div className="keyword-header">
        <span className="report-title">분석 리포트</span>
        <span className="report-arrow">›</span>
      </div>

      <div className="report-keyword-title">
        <div className="title-row">
          <img src={bookIcon} alt="아이콘" className="icon" />
          <span>오늘의 감정 키워드</span>
        </div>

        <div className="keyword-list" style={{ minHeight: '30px' }}>
          {loading ? (
            <span className="keyword-badge">불러오는 중...</span>
          ) : notFound ? (
            <span className="keyword-badge">
              아직 오늘의 감정이 등록되지 않았어요. 어떤 하루를 보내셨나요?
            </span>
          ) : (
            keywords.map((word, idx) => (
              <span key={idx} className="keyword-badge">
                {word}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="report-description">
        오늘 대화에서 마일로가 감정을 분석해 요약해줘요
      </div>
    </div>
  );
};

export default EmotionKeyword;
