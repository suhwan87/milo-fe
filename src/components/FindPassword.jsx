import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/axios';
import '../styles/FindPassword.css';

function FindPassword() {
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const navigate = useNavigate();

  const handleFindPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/users/verify-user', {
        nickname,
        userId,
        email,
      });
      setTempPassword(res.data.tempPassword); // ✅ 임시 비밀번호 저장
    } catch (err) {
      setTempPassword(''); // 실패 시 비워두기
    } finally {
      setSearchAttempted(true);
    }
  };

  return (
    <div className="findpw-container">
      <button
        className="findpass-back-button"
        onClick={() => window.history.back()}
      >
        ←
      </button>
      <h2 className="findpw-title">비밀번호 찾기</h2>
      <form onSubmit={handleFindPassword} className="findpw-form">
        <input
          type="text"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="아이디를 입력하세요"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">비밀번호 찾기</button>
      </form>

      {searchAttempted && (
        <div className="result-box">
          {tempPassword ? (
            <div className="success-box">
              <p>
                아래 임시 비밀번호로 로그인 후, 꼭 비밀번호를 변경해 주세요.
              </p>
              <p className="temp-password">
                <strong>{tempPassword}</strong>
              </p>
              <div className="button-group">
                <button onClick={() => navigate('/login')} className="gray-btn">
                  로그인하기
                </button>
              </div>
            </div>
          ) : (
            <div className="fail-box">
              <p className="no-result">일치하는 정보가 없습니다.</p>
              <div className="button-group">
                <button
                  onClick={() => navigate('/find-id')}
                  className="blue-btn"
                >
                  아이디 찾기
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="gray-btn"
                >
                  회원가입 하기
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FindPassword;
