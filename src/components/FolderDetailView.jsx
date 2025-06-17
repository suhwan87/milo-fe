import React, { useState } from 'react';
import '../styles/FolderDetailView.css';

const FolderDetailView = ({ folder, onBack }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="mind-drawer-container">
      {/* 상단 헤더 */}
      <div className="mind-drawer-header">
        <button className="back-button" onClick={onBack}>
          ←
        </button>
        <h2>마음 서랍장</h2>
      </div>
      {/* 삭제 확인 모달 */}
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
              <button
                className="confirm-btn"
                onClick={() => {
                  console.log('삭제 실행 예정');
                  setShowDeleteModal(false);
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="folder-detail-container animate-slide-in">
        {/* 폴더 정보 */}
        <div className={`folder-info ${folder.colorClass}`}>
          <div className="folder-tab" />
          <span className="folder-icon">🤍</span>
          <span className="folder-title">{folder.title}</span>
          <span className="folder-count">{folder.count}</span>
        </div>

        {/* 문장 카드 */}
        <div className="folder-sentence-card-wrapper">
          <button className="folder-arrow-btn">〈</button>

          <div className="folder-sentence-card">
            <div className="folder-sentence-header">
              <span className="folder-sentence-index">3/10</span>
              <div className="folder-sentence-actions">
                <span className="folder-edit-icon">✎</span>
                <span
                  className="folder-delete-icon"
                  onClick={() => setShowDeleteModal(true)}
                >
                  🗑
                </span>
              </div>
            </div>

            <div className="folder-sentence-date">0000.00.00(요일)</div>
            <div className="folder-sentence-title">회복 문장 제목</div>
            <div className="folder-sentence-content">
              회복 문장 회복 문장
              <br />
              회복 문장 회복 문장
            </div>
            <div className="folder-sentence-tags">#감정 #감정</div>
          </div>

          <button className="folder-arrow-btn">〉</button>
        </div>
      </div>
    </div>
  );
};

export default FolderDetailView;
