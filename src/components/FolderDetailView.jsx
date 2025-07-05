// 회복 문장 보관함 공통 컴포넌트
import React, { useState, useEffect } from 'react';
import '../styles/FolderDetailView.css';
import api from '../config/axios';

const FolderDetailView = ({ folder, onSentenceDelete }) => {
  const [sentences, setSentences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSentence, setSelectedSentence] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState('');

  const CARD_WIDTH = 355;
  const CARD_MARGIN = 20;

  // 폴더 내 회복 문장 조회 + 분석 리포트 연동
  useEffect(() => {
    const fetchSentencesWithEmotion = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/recovery/sentence/${folder.folderId}`);
        const token = localStorage.getItem('token');

        const enriched = await Promise.all(
          res.data.map(async (s) => {
            const date = s.createdAt.split('T')[0]; // 날짜 추출

            try {
              const emotionRes = await api.get('/report/daily', {
                headers: { Authorization: `Bearer ${token}` },
                params: { date },
              });

              return {
                ...s,
                emotion: emotionRes.data.mainEmotion,
              };
            } catch (e) {
              console.warn('해당 날짜 리포트 없음:', date);
              return { ...s, emotion: null };
            }
          })
        );

        // 최신순 정렬 후 상태 설정
        setSentences(
          enriched.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSentencesWithEmotion();
  }, [folder.folderId]);

  // 문장 삭제 처리
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.delete('/recovery/sentence/folder', {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          folderId: folder.folderId,
          sentenceId: selectedSentence.sentenceId, // 고유 ID로 삭제
        },
      });

      // 삭제 후 상태 갱신 및 인덱스 조정
      setSentences((prev) => {
        const updated = prev.filter(
          (s) => s.sentenceId !== selectedSentence.sentenceId
        );

        setCurrentIndex((prevIndex) =>
          prevIndex >= updated.length && updated.length > 0
            ? updated.length - 1
            : prevIndex
        );

        return updated;
      });

      setShowDeleteModal(false);
      onSentenceDelete?.(); // count 갱신 등
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('문장 삭제 중 오류가 발생했어요.');
    }
  };

  // 문장 수정 처리
  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.put(
        '/recovery/sentence/update',
        {
          sentenceId: selectedSentence.sentenceId, // 고유 ID
          updatedContent: editContent,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 클라이언트 상태 업데이트
      setSentences((prev) =>
        prev.map((s) =>
          s.sentenceId === selectedSentence.sentenceId
            ? { ...s, content: editContent }
            : s
        )
      );

      setShowEditModal(false);
    } catch (err) {
      console.error('수정 실패:', err);
      alert('문장 수정 중 오류가 발생했어요.');
    }
  };

  // 슬라이드 이동 핸들러
  const slideTo = (dir) => {
    if (dir === 'prev' && currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    if (dir === 'next' && currentIndex < sentences.length - 1)
      setCurrentIndex((prev) => prev + 1);
  };

  // 드래그/터치 이동 감지
  const [startX, setStartX] = useState(null);
  const handleMove = (endX) => {
    const distance = startX - endX;
    if (distance > 50) slideTo('next');
    else if (distance < -50) slideTo('prev');
  };

  // 메시지 url 하이퍼링크
  const linkifyTextLine = (line) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const parts = line.split(urlRegex);

    return parts.map((part, idx) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={idx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'blue', wordBreak: 'break-all' }}
          >
            {part}
          </a>
        );
      } else {
        return <span key={idx}>{part}</span>;
      }
    });
  };

  return (
    <div className="folder-detail-container animate-slide-in">
      <div className="folder-sentence-card-container">
        {isLoading ? (
          <p className="loading-message"></p>
        ) : sentences.length > 0 ? (
          <div className="folder-sentence-card-wrapper">
            {/* 왼쪽 화살표 */}
            <button
              className="folder-arrow-btn"
              onClick={() => slideTo('prev')}
              disabled={currentIndex === 0}
            >
              〈
            </button>

            {/* 슬라이드 카드 영역 */}
            <div
              className="slider-track"
              onTouchStart={(e) => setStartX(e.targetTouches[0].clientX)}
              onTouchEnd={(e) => handleMove(e.changedTouches[0].clientX)}
              onMouseDown={(e) => setStartX(e.clientX)}
              onMouseUp={(e) => handleMove(e.clientX)}
              style={{
                transform: `translateX(${-(currentIndex * (CARD_WIDTH + CARD_MARGIN))}px)`,
                marginLeft: `calc(50% - ${CARD_WIDTH / 2}px)`,
              }}
            >
              {sentences.map((sentence, index) => (
                <div
                  key={index}
                  className="folder-sentence-card"
                  style={{
                    opacity: index === currentIndex ? 1 : 0.5,
                    transform:
                      index === currentIndex ? 'scale(1)' : 'scale(0.94)',
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                  }}
                >
                  <div className="folder-sentence-header">
                    <span className="folder-sentence-index">
                      {index + 1}/{sentences.length}
                    </span>
                    <div className="folder-sentence-actions">
                      <span
                        className="folder-edit-icon"
                        onClick={() => {
                          setEditContent(sentence.content);
                          setSelectedSentence(sentence);
                          setShowEditModal(true);
                        }}
                      >
                        ✎
                      </span>
                      <span
                        className="folder-delete-icon"
                        onClick={() => {
                          setSelectedSentence(sentence);
                          setShowDeleteModal(true);
                        }}
                      >
                        🗑
                      </span>
                    </div>
                  </div>

                  <div className="folder-sentence-date">
                    {new Date(sentence.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                  <div className="folder-sentence-content scrollable">
                    {linkifyTextLine(sentence.content)}
                  </div>
                  <div className="folder-sentence-tags">
                    #{sentence.emotion || '감정'}
                  </div>
                </div>
              ))}
            </div>

            {/* 오른쪽 화살표 */}
            <button
              className="folder-arrow-btn"
              onClick={() => slideTo('next')}
              disabled={currentIndex === sentences.length - 1}
            >
              〉
            </button>
          </div>
        ) : (
          <p className="no-sentences">아직 등록된 문장이 없어요.</p>
        )}
      </div>

      {/* 삭제 모달 */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>정말 삭제하시겠습니까?</h3>
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                취소
              </button>
              <button className="confirm-btn" onClick={handleDelete}>
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>문장 수정하기</h3>
            <textarea
              className="edit-textarea"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <div className="modal-buttons">
              <button
                className="cancel-btn"
                onClick={() => setShowEditModal(false)}
              >
                취소
              </button>
              <button className="confirm-btn" onClick={handleEditSave}>
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderDetailView;
