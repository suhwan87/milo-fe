// 아이디 찾기 컴포넌트
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import '../styles/FindId.css';

function FindId() {
  const navigate = useNavigate();

  // 사용자 입력 상태
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');

  // 조회 결과 상태
  const [foundId, setFoundId] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);

  // 아이디 찾기 요청 처리
  const handleFindId = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/users/find-id', {
        nickname,
        email,
      });
      setFoundId(res.data.userId); // 성공 시 아이디 저장
    } catch (err) {
      setFoundId('');
    } finally {
      setSearchAttempted(true); // 결과 박스 표시
    }
  };

  return (
    <div className="findid-container">
      <h2 className="findid-title">아이디 찾기</h2>
      {/* ← 버튼: 이전 페이지로 */}
      <button
        className="findid-back-button"
        onClick={() => window.history.back()}
      >
        ←
      </button>
      {/* 아이디 찾기 입력폼 */}
      <form onSubmit={handleFindId} className="findid-form">
        <input
          type="text"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">아이디 찾기</button>
      </form>

      {/* 조회 결과 표시 */}
      {searchAttempted && (
        <div className="result-box">
          <h3>회원님의 아이디를 확인해 주세요</h3>
          {/* 조회 성공 시 */}
          {foundId ? (
            <div className="success-box">
              <p className="found-id">{foundId}</p>
              <div className="button-group">
                <button onClick={() => navigate('/login')} className="gray-btn">
                  로그인하기
                </button>
                <button
                  onClick={() => navigate('/find-password')}
                  className="blue-btn"
                >
                  비밀번호찾기
                </button>
              </div>
            </div>
          ) : (
            // 조회 실패 시
            <div className="fail-box">
              <p className="no-result">조회결과가 없습니다.</p>
              <div className="button-group">
                <button onClick={() => navigate('/login')} className="gray-btn">
                  로그인하기
                </button>
                <button
                  onClick={() => navigate('/find-password')}
                  className="blue-btn"
                >
                  비밀번호찾기
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FindId;
