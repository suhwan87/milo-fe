import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import '../styles/FindId.css';

function FindId() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [foundId, setFoundId] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleFindId = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/users/find-id', {
        nickname,
        email,
      });
      setFoundId(res.data.userId); // 서버에서 userId 반환
    } catch (err) {
      setFoundId('');
    } finally {
      setSearchAttempted(true);
    }
  };

  return (
    <div className="findid-container">
      <h2 className="findid-title">아이디 찾기</h2>
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

      {searchAttempted && (
        <div className="result-box">
          <h3>회원님의 아이디를 확인해 주세요</h3>
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
