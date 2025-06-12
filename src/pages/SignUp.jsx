// src/components/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignUp.css';
import Swal from 'sweetalert2';

function SignUp() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  // 회원가입 폼
  const [id, setId] = useState('');
  const [idMessage, setIdMessage] = useState('');
  const [isIdAvailable, setIsIdAvailable] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  // 약관동의
  const [agreeService, setAgreeService] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  // 에러메시지
  const [passwordError, setPasswordError] = useState('');
  const [agreementError, setAgreementError] = useState('');

  // 아이디 중복 체크시
  const handleCheckDuplicate = async () => {
    // try {
    //   //예시: 실제로는 백엔드 API로 요청해야 함
    //   const response = await fetch(`/api/check-id?id=${id}`);
    //   const data = await response.json();
    //   if (data.available) {
    //     setIsIdAvailable(true);
    //     setIdMessage('사용 가능한 아이디입니다.');
    //   } else {
    //     setIsIdAvailable(false);
    //     setIdMessage('이미 존재하는 아이디입니다.');
    //   }
    // } catch (error) {
    //   setIdMessage('오류가 발생했습니다.');
    //   setIsIdAvailable(false);
    // }
  };

  // 회원가입 폼 제출시
  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setAgreementError('');

    if (password !== passwordConfirm) {
      setPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!agreeService || !agreePrivacy) {
      setAgreementError('약관 동의는 필수입니다.');
      return;
    }

    console.log('회원가입 정보:', { id, password, nickname, email });
    // 이후 서버 연동 예정

    // ✅ SweetAlert2로 알림 후 이동
    Swal.fire({
      title: '회원가입 완료!',
      text: '로그인 페이지로 이동합니다 😊',
      icon: 'success',
      confirmButtonColor: '#ffa158',
      confirmButtonText: '확인',
    }).then(() => {
      setFadeOut(true);
      setTimeout(() => {
        navigate('/login');
      }, 300); // 페이드아웃 타이밍 맞춤
    });
  };

  return (
    <div className={`signup ${fadeOut ? 'fade-out' : ''}`}>
      <div className="signup">
        <h2 className="logo2">Milo.</h2>
        <p className="subtitle">가입을 환영합니다.</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label>아이디</label>
          <div className="input-with-button">
            <input
              type="text"
              placeholder="아이디 입력(6~20자)"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
            <button
              type="button"
              className="check-btn"
              onClick={handleCheckDuplicate}
            >
              중복확인
            </button>
          </div>

          {/* ✅ 아이디 사용 가능/불가 메시지 표시 */}
          {isIdAvailable !== null && (
            <p className={`id-message ${isIdAvailable ? 'valid' : 'invalid'}`}>
              {idMessage}
            </p>
          )}

          <label>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호 입력(문자, 숫자, 특수문자 포함 8~20자)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호 재입력"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
          {/* ✅ 패스워드 불일치 메시지 표시 */}
          {passwordError && <p className="error-message">{passwordError}</p>}

          <label>닉네임</label>
          <input
            type="text"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />

          <label>이메일</label>
          <input
            type="email"
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* 이용약관 */}
          <div className="checkbox-row">
            <input
              type="checkbox"
              id="privacy"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
            />
            <span
              onClick={() => setShowPrivacyModal(true)}
              className="terms-text"
            >
              개인정보 수집 및 이용
            </span>
            <span className="required">(필수)</span>

            <br></br>

            <input
              type="checkbox"
              id="service"
              checked={agreeService}
              onChange={(e) => setAgreeService(e.target.checked)}
            />
            <span
              onClick={() => setShowServiceModal(true)}
              className="terms-text"
            >
              서비스 이용약관
            </span>
            <span className="required">(필수)</span>
          </div>
          {/* ✅ 약관동의 필수 메시지 표시 */}
          {agreementError && <p className="error-message">{agreementError}</p>}

          {/* 회원가입 버튼 */}
          <button type="submit" className="submit-btn">
            Sign up
          </button>
        </form>

        {/* 모달 */}
        {/* 개인정보 수집 모달 */}
        {showPrivacyModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>개인정보 수집 및 이용</h3>
              <p>이곳에 개인정보 수집 약관 내용을 넣어주세요.</p>
              <button onClick={() => setShowPrivacyModal(false)}>닫기</button>
            </div>
          </div>
        )}

        {/* 서비스 이용약관 모달 */}
        {showServiceModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>서비스 이용약관</h3>
              <p>이곳에 서비스 이용약관 내용을 넣어주세요.</p>
              <button onClick={() => setShowServiceModal(false)}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
