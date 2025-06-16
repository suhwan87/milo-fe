// src/pages/MindDrawerPage.jsx
import React from 'react';
import '../styles/MindDrawerPage.css';

const MindDrawerPage = () => {
  // ✅ 마음 서랍 데이터 리스트 정의
  const drawerList = [
    { title: '위로용 문장', count: 5 },
    { title: '안정용 문장', count: 8 },
    { title: '잠 안 올 때', count: 3 },
    { title: '회복용', count: 2 },
  ];

  return (
    <div className="mind-drawer-container">
      {/* 헤더 */}
      <div className="mind-drawer-header">
        <button className="back-button" onClick={() => window.history.back()}>
          ←
        </button>
        <h2>마음 서랍장</h2>
      </div>

      {/* 상단 버튼 */}
      <div className="mind-drawer-top-buttons">
        <button className="action-button">＋</button>
        <button className="action-button">🔍</button>
      </div>

      {/* 카드 리스트 */}
      <div className="mind-drawer-list">
        {drawerList.map((item, idx) => (
          <div className="mind-card" key={idx}>
            <div className="card-left">
              <span className="card-menu">⋮</span>
              <span className="card-icon">🤍</span>
            </div>
            <span className="card-title">{item.title}</span>
            <span className="card-count">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MindDrawerPage;
